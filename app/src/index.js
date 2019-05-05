import { GraphQLServer } from "graphql-yoga"

/** 
 * Type definitions (Type Schema) 
 * Scalar Types (Single value) => String, Boolean, Int, Float, ID 
 * Non-Scalar => Objects and Arrays
 */

// Demo users data
const users = [
    {
        id: "1",
        name: "Cristian",
        email: "cysantos21@gmail.com",
        age: 24
    }, 
    {
        id: "2",
        name: "Laura",
        email: "lauramojicamartinez1@gmail.com"
    },
    {
        id: "3",
        name: "Maya",
        email: "maya@example.com"
    }
]

const posts = [
    {
        id: "1",
        title: "First post",
        body: "This is the content of the first post ...",
        published: true
    }, 
    {
        id: "2",
        title: "Second post",
        body: "This is the body of the second post ...",
        published: false
    },
    {
        id: "3",
        title: "Third post",
        body: "This is the content of the third post ...",
        published: true
    }
]

const typeDefs = `
    type Query {      
        me: User!
        post: Post!
        users (query: String): [User!]!
        posts (query: String): [Post!]!
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
        },
        users (parents, { query }, ctx, info) {
            if (!query) return users
            return users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
        },
        posts (parents, { query }, ctx, info) {
            if (!query) return posts
            return posts.filter(p => {
                return (
                    p.title.toLowerCase().includes(query.toLowerCase()) ||
                    p.body.toLowerCase().includes(query.toLowerCase())
                )
            })
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ port: 3000 }, () => console.log('Server is up!'))