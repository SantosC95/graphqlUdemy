export default {
    users (parent, { query }, { prisma }, info) {
        /*if (!query) return db.users
        return db.users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))*/

        const prismaQ = {}
        if (query) {
            prismaQ.where = {
                OR: [
                    { name_contains: query },
                    { email_contains: query }
                ]
            }
        }
        return prisma
            .query
            .users(prismaQ, info)
    },
    posts (parent, { query }, { prisma }, info) {
        /*if (!query) return db.posts
        return db.posts.filter(p => {
            return (
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.body.toLowerCase().includes(query.toLowerCase())
            )
        })*/

        const prismaQ = {}
        if (query) {
            prismaQ.where = {
                OR: [
                    { title_contains: query },
                    { body_contains: query }
                ]
            }
        }
        return prisma
            .query
            .posts(prismaQ, info)
    },
    comments (parent, args, { prisma }, info) {
        /**
        if (!query) return db.comments
        return db.comments.filter(comment => comment.text.toLowerCase().includes(query.toLowerCase()))
         */
        const { query } = args
        const prismaQ = {}
        if (query) {
            prismaQ.where = {
                text_contains: query
            }
        }
        return prisma
            .query
            .comments(prismaQ, info)
    }
}