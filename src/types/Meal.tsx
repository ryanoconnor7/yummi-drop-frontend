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
    ingredients: string
    imageUrl: string
    chef?: User
    id: string
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
        'A tasty and healthy meal based on the traditional Kale Chicken Caesar with a homemade touch.',
    ingredients: 'chicken, kale, peppers, salt, pepper, caesar',
    imageUrl:
        'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFzdGF8ZW58MHx8MHx8&w=1000&q=80',
    chef: exampleChef,
    id: '123'
}

export const testMeals: Meal[] = [meal, meal, meal]

export interface GetMealsParams {
    portionSize: number
    category: string
    lat: number
    lon: number
    pickupDate: string
}

export async function getMeals(params: GetMealsParams): Promise<Meal[]> {
    const url = `${BACKEND_URL}/meals?${objToQueryString(params)}`

    console.log(url)
    const res = await fetch(url, { method: 'GET' })

    const json = await res.json()
    console.log('Meals json:', json)

    return json?.meals ?? []
}

interface OrderResponse {
    meal: Meal
    orderedMeal: Meal
}

export async function reserveMeal(meal: Meal, portions: number): Promise<OrderResponse> {
    const url = `${BACKEND_URL}/meals/order`
    const params = {
        mealId: meal.id,
        chefId: meal.chef?.id,
        portionsRequested: portions
    }

    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(params)
    })
    const json = await res.json()
    console.log('Meals json:', json)

    return json
}
