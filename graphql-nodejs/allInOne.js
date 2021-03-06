const express = require("express");
const app = express();
const PORT = 6969;
const { graphqlHTTP } = require("express-graphql");
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                if(args.id){
                    let obj = userData.find(o => o.id === args.id);
                    return [obj];
                }
                return userData;
            },
        },
    },
});


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                userData.push({
                    id: userData.length + 1,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    password: args.password,
                });
                return args;
            },
        },
    },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))


app.listen(PORT, () => {
    console.log("Server is Running");
});


/*

query{
  getAllUsers{
    id,
    firstName,
    lastName,
    email,
    password
  }
}

query{
  getAllUsers(id:1){
    id,
    firstName,
    lastName,
    email,
    password
  }
}


mutation {
  createUser(firstName: "Soumyadip", lastName: "Chowdhury", email: "soumya.note@gmail.com", password: "y0pWrGzmDz") {
    firstName
    lastName
    email
    password
  }
}




*/