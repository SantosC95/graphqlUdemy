import { getUserId } from "../utils/utils"

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
    posts (parent, { query }, { prisma, request }, info) {
        /*if (!query) return db.posts
        return db.posts.filter(p => {
            return (
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.body.toLowerCase().includes(query.toLowerCase())
            )
        })*/

        const userId = getUserId(request, false)
        
        const prismaQ = {}
        if (query) {
            prismaQ.where = {
                AND: [
                    {
                        OR: [
                            { published: true },
                            {
                                author: {
                                    id: userId
                                }
                            } 
                        ]
                    }, 
                    {
                        OR: [
                            { title_contains: query },
                            { body_contains: query }
                        ]
                    }
                ]
            }
        } else  {
            prismaQ.where = {
                OR: [
                    { published: true },
                    {
                        author: {
                            id: userId
                        }
                    }
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
    },
    async post(parent, args, ctx, info) {
        const { prisma, request } = ctx
        const { id } = args
        const userId = getUserId(request, false)

        const query = {
            where: {
                id,
                OR: [
                    { published: true },
                    {
                        author: {
                            id: userId
                        }
                    }
                ]
            }
        }

        const [ post ] = await prisma.query.posts(query, info)
        if (!post) {
            throw new Error('Post not found')
        }

        return post
    },
    me (parent, args, { prisma, request }, info) {
        const id = getUserId(request)
        return prisma.query.user({ where: { id }}, info)
    },
    myPosts(parent, { query }, { prisma, request }, info) {
        const userId = getUserId(request)
        const myQuery = {
            where: {
                AND: [
                    {
                        author: {
                            id: userId
                        }
                    }
                ]
            }
        }

        if (query) {
            myQuery.where.AND.push({
                OR: [
                    { title_contains: query },
                    { body_contains: query }
                ]
            })
        }

        return prisma.query.posts(myQuery, info)
    }
}