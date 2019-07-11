import jwt from "jsonwebtoken"

const getUserId = ( request, requireAuth = true ) => {
    const { headers } = request.request
    if (headers.authorization) {
        const token = headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, "PrismaTutorialSecret2019")
        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    }

    return null
}

export { getUserId }