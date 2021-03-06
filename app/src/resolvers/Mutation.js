import uuid from 'uuid/v4'

const module = {
    createUser (parent, args, { db }, info) {
        const data = args.data
        const emailTaken = db.users.some(user => user.email === args.email)
        if (emailTaken) {
            throw new Error('Email taken')
        }
        const user = {...{ id: uuid() }, ...data }
        db.users.push(user)
        return user
    },
    updateUser (parent, args, { db }) {
        const user = db.users.find(user => user.id === args.id)
        if(!user) throw new Error('User not found')
        if (args.data.email) {
            const emailTaken = db.users.some(user => user.email === args.data.email)
            if (emailTaken) throw new Error('Email already exists')
            user.email = args.data.email
        }
        if (args.data.name) user.name = args.data.name 
        if (typeof args.data !== 'undefined') {
            user.age = args.data.age
        }
        return user
    },
    deleteUser (parent, args, { db }) {
        const index = db.users.findIndex(user => user.id === args.id)
        if (index < 0) {
            throw new Error('User not found')
        }

        const deleted = db.users.splice(index, 1)
        db.posts = db.posts.filter(post => {
            const shouldDelete = post.author !== deleted[0].id
            if (shouldDelete) db.comments = db.comments.filter(comment => comment.post === post.id)
            return shouldDelete
        })
        db.comments = db.comments.filter(comment => comment.author !== deleted[0].id)
        return deleted[0]
    },
    createPost (parent, args, { db, pubsub }, info) {
        const data = {...args.data}
        const userExist = db.users.some(user => user.id === data.author)
        if (!userExist) {
            throw new Error('User not found')
        }
        const post = { ...data, ...{ id: uuid() }}
        db.posts.push(post)
        if (post.published)
            pubsub.publish('my-posts', {
                post: {
                    mutation: "CREATED",
                    data: post
                }
            })

        return post
    },
    updatePost: (parent, { id, data }, { db, pubsub }) => {
        const post = db.posts.find(post => post.id === id)
        if (!post) throw new Error('Post not found')

        /** Determine whether a post was created, deleted or updated */
        let event = null
        post.title = data.title || post.title
        post.body = data.body || post.body
        
        if (typeof data.published === 'boolean') {
            if (!post.published && data.published) event = "CREATED"
            if (post.published && !data.published) event = "DELETED"
            if (post.published && data.published) event = "UPDATED"
            post.published = data.published
        } else {
            if (post.published) 
                event = "UPDATED"
        }

        if (event) {
            pubsub.publish('my-posts', {
                post: {
                    mutation: event,
                    data: post
                }
            })
        }
        return post        
    },
    deletePost (parent, args, { db, pubsub }) {
        const index = db.posts.findIndex(post => post.id === args.id)
        if (index<0) throw new Error('Post not found')

        db.comments = db.comments.filter(comm => comm.post !== args.id)

        const [deleted] = db.posts.splice(index, 1)
        if (deleted.published) {
            pubsub.publish('my-posts', {
                post: {
                    mutation: "DELETED",
                    data: deleted
                }
            })
        }
        return deleted
    },
    createComment (parent, args, { db, pubsub }) {
        const data = {...args.data}
        const userExists = db.users.some(user => user.id === data.author)
        if (!userExists) {
            throw new Error('User not found')
        }

        const postExists = db.posts.some(post => post.id === data.post && post.published)
        if (!postExists) {
            throw new Error('Post not found')
        }

        const comment = {...{ id: uuid() }, ...data }
        db.comments.push(comment)
        pubsub.publish(`COMMENT:${data.post}`, { 
            comment: {
                mutation: "CREATED",
                data: comment
            } 
        })
        return comment
    },
    updateComment: (parent, { id, data }, ctx) => {
        const { db, pubsub } = ctx
        const comment = db.comments.find(comment => comment.id === id)
        if (!comment) throw new Error('Comment not found')
        comment.text = data.text || comment.text
        pubsub.publish(`COMMENT:${comment.post}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })
        return comment
    },
    deleteComment(parent, args, { db, pubsub }) {
        const index = db.comments.findIndex(comment => comment.id === args.id)
        if (index < 0) {
            throw new Error('Comment not found')
        }

        const [ comment ] = db.comments.splice(index, 1) 
        pubsub.publish(`COMMENT:${comment.post}`, {
            comment: {
                mutation: "DELETED",
                data: comment
            }
        })
        return comment
    }
}

export default module