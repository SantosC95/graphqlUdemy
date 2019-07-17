import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from "./resolvers" 

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://localhost:4466",
    secret: "Prism4S3rve3S3cr3t",
    fragmentReplacements
})

export default prisma