export default {
    posts (parent) {
        return db.posts.filter(p => p.author === parent.id)
    },
    comments (parent) {
        return db.comments.filter(c => c.author === parent.id)
    }
}