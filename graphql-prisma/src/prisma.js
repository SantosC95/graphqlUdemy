import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://localhost:4466"
})

const createPostForUser = async (authorId, data) =>  {
    try {
        const userExists = await prisma
            .exists
            .User({ id: authorId })
    
        if (!userExists) {
            throw new Error('User not found')
        }
    
        const post = await prisma
            .mutation
            .createPost({
                data: {
                    ... data,
                    author: {
                        connect: {
                            id: authorId
                        }
                    }
                }
            }, "{ id author { name id email posts { id title body published } } }")

        return post.author        
    } catch (error) {
        console.error(error)
    }
}

const updatePostForUser = async (postId, data) => {
    try {
        const postInDB = await prisma
            .exists
            .Post({ id: postId })

        if (!postInDB) {
            throw new Error('Post not found')
        }

        const Q = {
            where: { id: postId },
            data
        }
    
        const post = await prisma
            .mutation
            .updatePost(Q, '{ author { id name email posts { id title body published } } }')
    
        return post.author
        
    } catch (error) {
        console.error(error)
    }
}

const checkComments = () => {
    return prisma
        .exists
        .Comment({
            id: "cjw3qlyqw0089086139v4v7g4",
            author: {
                id: "cjw3qcogc005f08f1ufs7gkul"
            }
        })
}

(
    async () => {
        const data = await updatePostForUser("cjw2oxh9x01m60735jqkr6cov", {
            title: "Título de post editado XX",
            body: "Contenido de post editado GG"
        })
        console.log('Data: ', JSON.stringify(data, null, 4))
    }
)()