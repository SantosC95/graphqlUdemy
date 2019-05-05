import { GraphQLServer } from "graphql-yoga"

/** 
 * Type definitions (Type Schema) 
 * Scalar Types (Single value) => String, Boolean, Int, Float, ID 
 * Non-Scalar => Objects and Arrays
 */

const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        GPA: Float
        
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`
/** 
 * Resolvers
 */
const resolvers = {
    Query: {
        id: () => "abc123",
        name: () => "Cristian Santos",
        age: () => 24,
        employed: () => true,
        GPA: () => 4.65,

        title: () => "Introduction to Artificial Intelligence",
        price: () => 19.99,
        releaseYear: () => 2018,
        rating: () => 4.5,
        inStock: () => true
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ port: 3000 }, () => console.log('Server is up!'))