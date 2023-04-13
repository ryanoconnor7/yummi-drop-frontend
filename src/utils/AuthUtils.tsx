import { User } from 'firebase/auth'

export async function authenticatedHeaders(fbUser: User) {
    const token = await fbUser?.getIdToken()

    console.log('Token:', token)

    if (!token) throw 'Missing user or ID token'

    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}
