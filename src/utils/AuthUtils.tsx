import { User } from 'firebase/auth'

export async function authenticatedHeaders(fbUser?: User, authOptional: boolean = false) {
    const token = await fbUser?.getIdToken()

    console.log('Token:', token)

    if (!token && !authOptional) throw 'Missing user or ID token'

    const h = {
        'Content-Type': 'application/json'
    }
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
}
