import { getAuth, getIdToken, User as FBUser } from 'firebase/auth'
import { BACKEND_URL } from '../utils/Constants'
import { auth } from '../App'

export interface User {
    chefDetails: string
    firstName: string
    lastName: string
    username: string
    profilePicUrl: string
    id: string
}

export const exampleChef: User = {
    username: 'roconnor',
    firstName: 'John',
    lastName: 'Appleseed',
    chefDetails: 'I like to cook',
    profilePicUrl: 'https://d2az3zd39o5d63.cloudfront.net/linkedin-profile-picture-sunglasses.jpg',
    id: '345'
}

export const categories = [
    'All Categories',
    'Asian',
    'American',
    'Italian',
    'Latin American',
    'Local',
    'Mexican',
    'Caribbean',
    'Vegetarian',
    'Vegan',
    'Gluten Free'
]

export async function getCurrentUser(fbUser: FBUser): Promise<User> {
    const token = await fbUser?.getIdToken()

    console.log('Token:', token)

    if (!token) throw 'Missing user or ID token'

    const url = `${BACKEND_URL}/users`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log('Current user res:', res)

    const json = await res.json()

    return json
}
