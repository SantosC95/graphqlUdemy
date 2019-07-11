export default {
    count: {
        subscribe: ( parent, args, ctx, info ) => {
            const { pubsub } = ctx
            let count = 0
            setInterval(() => { 
                count++ 
                pubsub.publish('count', { count })
            }, 1000)
            return pubsub.asyncIterator('count')
        }
    },
    comment: {
        subscribe: ( parent, { postId }, { prisma }, info ) => {
            /*const post = db.posts.find(( post ) => post.id === postId && post.published)
            if (!post) throw new Error('Post not found')
            return pubsub.asyncIterator(`COMMENT:${postId}`)*/
            return prisma
                .subscription
                .comment({ 
                    where: {
                        node: {
                            post: {
                                id: postId
                            }
                        }
                    }
                }, info)
        }
    },
    post: {
        subscribe: ( _, __, { prisma }, info) => {
            return prisma
                .subscription
                .post({
                    where: {
                        node: {
                            published: true
                        }
                    }
                }, info)
        }
    }
}