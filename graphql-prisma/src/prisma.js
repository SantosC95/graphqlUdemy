import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from "./resolvers" 

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: "Prism4S3rve3S3cr3t",
    fragmentReplacements
})

export default prisma