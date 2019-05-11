// Demo users data
let users = [
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

let posts = [
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


let comments = [
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

const db = { users, posts, comments }
export default db