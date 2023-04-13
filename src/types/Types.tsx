import { getAuth, getIdToken, User as FUser } from 'firebase/auth'
import { BACKEND_URL } from '../utils/Constants'
import { auth } from '../App'
import { authenticatedHeaders } from '../utils/AuthUtils'

export type FBUser = FUser

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
