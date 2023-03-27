export interface User {
    chefDetails: string
    firstName: string
    lastName: string
    username: string
    profilePicUrl: string
}

export interface Meal {
    calories: number
    cost: number // dollars
    cuisineCategory: string
    mealName: string
    pickupLocation: [number, number]
    pickupTime: string
    portions: number
    summary: string
    imageUrl: string
    chef?: User
}

const exampleChef: User = {
    username: 'roconnor',
    firstName: 'John',
    lastName: 'Appleseed',
    chefDetails: 'I like to cook',
    profilePicUrl: 'https://d2az3zd39o5d63.cloudfront.net/linkedin-profile-picture-sunglasses.jpg'
}

const meal: Meal = {
    calories: 500,
    cost: 5.5,
    cuisineCategory: 'Italian',
    mealName: 'Kale Chicken Caeser',
    pickupLocation: [42.278, -83.738],
    pickupTime: 'March 27, 2023 at 7:00:00 PM UTC-4',
    portions: 8,
    summary:
        'A tasty and healthy meal based on the traditional Kale Chicken Caesar with a homemade touch. Ingredients: chicken, kale, peppers, salt, pepper, caesar',
    imageUrl:
        'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFzdGF8ZW58MHx8MHx8&w=1000&q=80',
    chef: exampleChef
}

export const testMeals: Meal[] = [meal, meal, meal]

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
