export default {
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
        if (!query) return ctx.db.users
        return ctx.db.users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    },
    posts (parent, { query }, { db }, info) {
        if (!query) return db.posts
        return db.posts.filter(p => {
            return (
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.body.toLowerCase().includes(query.toLowerCase())
            )
        })
    },
    comments (parent, args, { db }) {
        return db.comments
    }
}