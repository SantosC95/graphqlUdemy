import jwt from "jsonwebtoken"
import { hash } from "bcryptjs"

const secret = process.env.PRISMA_SECRET_TOKEN;

const getUserId = ( request, requireAuth = true ) => {
    const authorization = request.request ? 
        request.request.headers.authorization :
        request.connection.context.Authorization

    if (authorization) {
        const token = authorization.split(" ")[1]
        const decoded = jwt.verify(token, secret)
        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    }

    return null
}

const generateToken = ( userId ) => {
    return jwt.sign(
        { userId }, 
        secret, 
        { expiresIn: '7 days' }
    )
}

const hashPassword = ( password ) => {
    if (password.length < 8) {
        throw new Error('Password must be 8 characters or longer')
    }

    return hash(password, 10)
}

export { getUserId, generateToken, hashPassword }