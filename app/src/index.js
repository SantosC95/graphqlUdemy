import { GraphQLServer } from "graphql-yoga"

/** 
 * Type definitions (Type Schema) 
 * Scalar Types (Single value) => String, Boolean, Int, Float, ID 
 * Non-Scalar => Objects and Arrays
 */

const typeDefs = `
    type Query {      
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`
/** 
 * Resolvers
 */
const resolvers = {
    Query: {
        me() {
            return {
                id: "12345",
                name: "Cristian",
                email: "cysantos21@gmail.com",
                age: 24
            }
        },
        post() {
            return {
                id: "abc",
                title: "My Post",
                body: "This is the body of my post ...",
                published: true
            }
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ port: 3000 }, () => console.log('Server is up!'))