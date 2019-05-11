import { GraphQLServer } from "graphql-yoga"
import db from './db'

/** Resolvers */
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'

/** 
 * Type definitions (Type Schema) 
 * Scalar Types (Single value) => String, Boolean, Int, Float, ID 
 * Non-Scalar => Objects and Arrays
 */

const server = new GraphQLServer({ 
    typeDefs: "./src/schema.graphql", 
    resolvers: {
        Query,
        Mutation,
        Post,
        User,
        Comment
    },
    context: { db }
})
server.start({ port: 3000 }, () => console.log('Server is up!'))