import { GraphQLServer, PubSub } from "graphql-yoga"
import db from './db'

/** Resolvers */
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'
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
        Subscription
    },
    context: { db, pubsub, prisma }
})

server.start({ port: 3000 }, () => console.log('Server is up!'))