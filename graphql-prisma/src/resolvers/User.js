import { getUserId } from "../utils/utils"

export default {
    email (parent, args, { request }, info) {
        const userId = getUserId(request, false)

        if (userId && userId === parent.id) {
            return parent.email
        }

        return null
    }
}