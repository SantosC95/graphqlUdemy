export default {
    author(parent, __ , { db }) {
        return db.users.find(user => user.id === parent.author)
    },
    post(parent, __ , { db }) {
        return db.posts.find(post => post.id === parent.post)
    }
}