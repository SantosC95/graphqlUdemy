import { GraphQLServer, PubSub } from "graphql-yoga"
import db from './db'

/** Resolvers and Prisma modules */
import { resolvers } from "./resolvers"
import prisma from './prisma'
const pubsub = new PubSub()

/** 
 * Type definitions (Type Schema) 
 * Scalar Types (Single value) => String, Boolean, Int, Float, ID 
 * Non-Scalar => Objects and Arrays
 */

const server = new GraphQLServer({ 
    typeDefs: "./src/schema.graphql", 
    resolvers,
    context (request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    }
})

server.start({ port: 3000 }, () => console.log('Server is up!'))