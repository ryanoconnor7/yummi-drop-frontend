import { Position } from '../types/Meal'
import { point } from '@turf/turf'
import distance from '@turf/distance'

export function distanceMiles(from: Position, to: Position) {
    return distance([from._longitude, from._latitude], [to._longitude, to._latitude], {
        units: 'miles'
    })
}
