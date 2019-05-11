export default {
    author(parent, __, { db }) {
        return db.users.find(user => user.id === parent.author)
    },
    comments(parent, __, { db }) {
        return db.comments.filter(co => co.post === parent.id)
    }
}