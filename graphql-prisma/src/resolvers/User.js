import { getUserId } from "../utils/utils"

export default {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve (parent, args, { request }) {
            const userId = getUserId(request, false)
    
            if (userId && userId === parent.id) {
                return parent.email
            }
    
            return null
        }
    }
}