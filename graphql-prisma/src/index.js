import { GraphQLServer, PubSub } from "graphql-yoga"
import db from './db'

/** Resolvers */
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import prisma from './prisma'

const pubsub = new PubSub()

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
        Subscription,
        User
    },
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