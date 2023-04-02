import { BACKEND_URL } from '../utils/Constants'
import { objToQueryString } from '../utils/StringUtils'
import { exampleChef, User } from './Types'

export interface Position {
    _latitude: number
    _longitude: number
}

export interface Meal {
    calories: number
    cost: number // dollars
    cuisineCategory: string
    mealName: string
    pickupLocation: Position
    pickupTime: {
        _seconds: number
    }
    portions: number
    summary: string
    imageUrl: string
    chef?: User
}

const meal: Meal = {
    calories: 500,
    cost: 5.5,
    cuisineCategory: 'Italian',
    mealName: 'Kale Chicken Caesar',
    pickupLocation: { _latitude: 42.278, _longitude: -83.738 },
    pickupTime: { _seconds: 1680217200 },
    portions: 8,
    summary:
        'A tasty and healthy meal based on the traditional Kale Chicken Caesar with a homemade touch. Ingredients: chicken, kale, peppers, salt, pepper, caesar',
    imageUrl:
        'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFzdGF8ZW58MHx8MHx8&w=1000&q=80',
    chef: exampleChef
}

export const testMeals: Meal[] = [meal, meal, meal]

export interface GetMealsParams {
    portionSize: number
    location: Position
    category: string
}

export async function getMeals(params: GetMealsParams): Promise<Meal[]> {
    const url = `${BACKEND_URL}/meals?${objToQueryString(params)}`

    console.log(url)
    const res = await fetch(url, { method: 'GET' })

    const json = await res.json()
    console.log('Meals json:', json)

    return json?.meals ?? []
}
