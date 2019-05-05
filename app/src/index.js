import { GraphQLServer } from "graphql-yoga"

/** Type definitions (Type Schema) */
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`
/** 
 * Resolvers
 */
const resolvers = {
    Query: {
        hello () {
            return "This is my first query!" 
        },
        name: () => "Cristian Santos",
        location: function () {
            return "Barranquilla"
        },
        bio () {
            return "Vivo en Barranquilla y trabajo en NativApps"
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start({ port: 3000 }, () => console.log('Server is up!'))