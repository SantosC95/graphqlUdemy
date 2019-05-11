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
        published: true,
        author: "1"
    }, 
    {
        id: "2",
        title: "Second post",
        body: "This is the body of the second post ...",
        published: false,
        author: "1"
    },
    {
        id: "3",
        title: "Third post",
        body: "This is the content of the third post ...",
        published: true,
        author: "2"
    }
]


const comments = [
    {
        id: "100",
        text: "Primer comentario",
        author: "1",
        post: "1"
    },
    {
        id: "101",
        text: "Este es un comentario randomn jdajdasjiohgds ...",
        author: "2",
        post: "1"
    },
    {
        id: "102",
        text: "Tercer comentario en el curso de GraphQL",
        author: "3",
        post: "2"
    },
    {
        id: "104",
        text: "Último comentario para este ejemplo de Comments en GraphQL",
        author: "1",
        post: "3"
    }
]

const typeDefs = `
    type Query {      
        me: User!
        post: Post!
        users (query: String): [User!]!
        posts (query: String): [Post!]!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        users (parent, { query }, ctx, info) {
            if (!query) return users
            return users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
        },
        posts (parent, { query }, ctx, info) {
            if (!query) return posts
            return posts.filter(p => {
                return (
                    p.title.toLowerCase().includes(query.toLowerCase()) ||
                    p.body.toLowerCase().includes(query.toLowerCase())
                )
            })
        },
        comments (parent, args) {
            return comments
        }
    },
    Post: {
        author(parent) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent) {
            return comments.filter(co => co.post === parent.id)
        }
    },
    User: {
        posts (parent) {
            return posts.filter(p => p.author === parent.id)
        },
        comments (parent) {
            return comments.filter(c => c.author === parent.id)
        }
    },
    Comment: {
        author(parent) {
            return users.find(user => user.id === parent.author)
        },
        post(parent) {
            return posts.find(post => post.id === parent.post)
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ port: 3000 }, () => console.log('Server is up!'))