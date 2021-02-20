var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
type RootQuery {
    getAll: [Rest]
}
type Rest{
    id:Int,
    name:String
}
type Mutation{
    create: [Rest]
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

const data = [{ id: 1, name: "One" }];
let count = 2;
const resolver = {
    getAll: () => { return data },
    create: (props) => {
        console.log(props);
        let d = { id: count, name: 'New name' };
        data.push(d);
        return data;
    }
}

var root = { hello: () => 'Hello world!', sample: () => 'test' };

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));