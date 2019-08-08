import { hash, compare } from "bcryptjs"
import jwt from "jsonwebtoken"
import { getUserId } from "../utils/utils"

const myModule = {
    async createUser (parent, args, { prisma }) {
        const data = args.data
        const emailTaken = await prisma.exists.User({ email: data.email })
        if (emailTaken) {
            throw new Error('Email taken')
        }

        if (data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer')
        }

        const password = await hash(data.password, 10)
        const user = await prisma.mutation.createUser({ data: { ...data, password }})

        return {
            user,
            token: jwt.sign({ userId: user.id }, "PrismaTutorialSecret2019")
        }

        /*const emailTaken = db.users.some(user => user.email === args.email)
        if (emailTaken) {
            throw new Error('Email taken')
        }
        const user = { id: uuid(), ...data }
        db.users.push(user)
        return user*/
    },
    updateUser (parent, args, { prisma, request }, info) {
        const { data } = args
        const id = getUserId(request)
        return prisma.mutation.updateUser({ where: { id }, data }, info)

        /*const user = db.users.find(user => user.id === args.id)
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
        return user*/
    },
    async deleteUser (parent, args, { prisma, request }) {
        const id = getUserId(request)
        return prisma.mutation.deleteUser({ where: { id } })
        /*const index = db.users.findIndex(user => user.id === args.id)
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
        return deleted[0]*/
    },
    async createPost (parent, args, { pubsub, prisma, request }, info) {
        /** Get userId from token */
        const userId = getUserId(request)
        const data = { ...args.data }
        const userExist = await prisma.exists.User({ id: data.author })
        if (!userExist) {
            throw new Error('User not found')
        }

        let post = { ...data }
        delete post.author
        post.author = {
            connect: {
                id: userId
            }
        }

        return prisma.mutation.createPost({ data: post }, info)
        /*const userExist = db.users.some(user => user.id === data.author)
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

        return post*/
    },
    updatePost: async (parent, { id, data }, { pubsub, prisma, request }, info) => {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({ id, author: { id: userId }})
        if (!postExists) {
            throw new Error('Unable to update post')
        }

        const isPublished = await prisma.exists.Post({
            id, 
            published: true
        })

        if (isPublished && !data.published) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id
                    }
                }
            })
        }

        return prisma.mutation.updatePost({ where: { id }, data }, info)

        /*const post = db.posts.find(post => post.id === id)
        if (!post) throw new Error('Post not found')

        // Determine whether a post was created, deleted or updated
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
        return post*/        
    },
    async deletePost (parent, args, { pubsub, prisma, request }, info) {
        const userId = getUserId(request)
        const { id } = args
        const postExists = await prisma
            .exists
            .Post({ id, author: { id: userId }})

        if (!postExists) {
            throw new Error('Post not found')
        }
        return prisma.mutation.deletePost({ where: { id }}, info) 

        /*const index = db.posts.findIndex(post => post.id === args.id)
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
        return deleted*/
    },
    async createComment (parent, args, { pubsub, prisma, request }, info) {
        const data = {...args.data}
        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({ id: data.post, published: true })
        if (!postExists) {
            throw new Error('Unable to create comment')
        }

        let comment = {...data}
        delete comment.author
        delete comment.post
        comment = {
            ...comment, 
            author: {
                connect: {
                    id: userId
                }
            },
            post: {
                connect: {
                    id: data.post
                }
            }
        }

        return prisma.mutation.createComment({ data: comment }, info)
        /*const userExists = db.users.some(user => user.id === data.author)
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
        return comment*/
    },
    updateComment: async (parent, { id, data }, ctx, info) => {
        const { prisma, request } = ctx
        const userId = getUserId(request)
        const thereIsComment = await prisma.exists.Comment({ id, author: { id: userId }})
        if (!thereIsComment) {
            throw new Error('Unable to update comment')
        }

        return prisma
            .mutation
            .updateComment({ where: { id }, data }, info)

        /*const comment = db.comments.find(comment => comment.id === id)
        if (!comment) throw new Error('Comment not found')
        comment.text = data.text || comment.text
        pubsub.publish(`COMMENT:${comment.post}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })
        return comment*/
    },
    async deleteComment(parent, { id }, { pubsub, prisma, request }, info) {
        const userId = getUserId(request)
        const thereIsComment = await prisma.exists.Comment({ id, author: { id: userId }}) 
        if (!thereIsComment) {
            throw new Error('Unable to delete comment')
        }
        return prisma.mutation.deleteComment({ where: { id }}, info)
        /*const index = db.comments.findIndex(comment => comment.id === args.id)
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
        return comment*/
    },
    async login(parent, { data }, { prisma }, info) {
        const { email, password } = data
        const thereIsEmail = await prisma.exists.User({ email })
        if (!thereIsEmail) {
            throw new Error('Wrong Credentials')
        }

        const user = await prisma.query.user({ where: { email }})
        const isValidPassword = await compare(password, user.password)
        if (!isValidPassword) {
            throw new Error('Wrong Credentials')
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, "PrismaTutorialSecret2019")
        }
    }
}

export default myModule