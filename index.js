var express = require('express');
var { buildSchema } = require('graphql');
var express_graphql = require('express-graphql');
const app = express();
const { PubSub} = require('graphql-subscriptions');

const pubsub = new PubSub();

const NEW_USER = 'new_user';

const schema = buildSchema(`
       type RootQuery {
        getAll: [Rest]
    }
    type Rest{
        id:Int,
        name:String
    }
    type Mutation{
        create: Rest
    }
    type Result {
    id: Int
    }
    type Subscription{
        newUser: Result
    }
    schema {
        query: RootQuery,
        mutation:Mutation
        subscription:Subscription
    }
`);
const data=[{id:1,name:"One"}];

let count =2;
const resolver={
    getAll: () => { return data },
    create:()=>{
        let d = { id:count , name: 'New name' };
        data.push(d);
        pubsub.publish(NEW_USER, { id:count});
        count +=1; 
        return d;
    },
    newUser:async ()=>{
        const iterator = pubsub.asyncIterator(NEW_USER);        
        const newUser =await iterator.next();
       return {id:newUser.value.id}
        
    },
}

app.use('/graph', express_graphql({
    schema: schema,
    rootValue:resolver,
    graphiql: true
}));

app.listen(4000,()=>{console.log('in 4000')})