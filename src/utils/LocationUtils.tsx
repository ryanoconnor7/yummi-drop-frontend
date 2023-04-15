import { Meal, Position } from '../types/Meal'
import { bbox, featureCollection, point } from '@turf/turf'
import distance from '@turf/distance'

export function distanceMiles(from: Position, to: Position) {
    return distance([from._longitude, from._latitude], [to._longitude, to._latitude], {
        units: 'miles'
    })
}

export const FEET_TO_DEG = 1 / 300000.0

export function offsetBoundsByRadius(bounds: number[], radius: number) {
    let [minLng, minLat, maxLng, maxLat] = bounds
    minLng -= radius * FEET_TO_DEG
    maxLng += radius * FEET_TO_DEG
    minLat -= radius * FEET_TO_DEG
    maxLat += radius * FEET_TO_DEG
    return [minLng, minLat, maxLng, maxLat]
}

export function bboxOfMeals(meals: Meal[], userLoc?: Position) {
    const points = meals.map(m => point([m.pickupLocation._longitude, m.pickupLocation._latitude]))
    console.log('points:', points)

    if (userLoc) points.push(point([userLoc._longitude, userLoc._latitude]))
    const collection = featureCollection(points)
    let bounds: number[] = bbox(collection)
    let [minLng, minLat, maxLng, maxLat] = bounds
    if (
        Math.abs(minLng - maxLng) < 500 / FEET_TO_DEG ||
        Math.abs(maxLat - minLat) < 500 / FEET_TO_DEG
    )
        bounds = offsetBoundsByRadius(bounds, 1000)
    return bounds
}

export async function getCurrentLocation(): Promise<Position | undefined> {
    return new Promise<Position | undefined>((res, rej) => {
        navigator.geolocation.getCurrentPosition(
            loc => {
                res({ _longitude: loc.coords.longitude, _latitude: loc.coords.latitude })
            },
            e => {
                console.log('Error fetching user position:', e.message)
                res(undefined)
            }
        )
    })
}

export function getMapPadding(sheetUp: boolean) {
    return {
        bottom: window.innerHeight * (sheetUp ? 0.6 : 0.2),
        top: 64,
        left: 16,
        right: 16
    }
}
