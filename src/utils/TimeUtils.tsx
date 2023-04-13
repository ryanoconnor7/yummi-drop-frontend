import moment, { Moment } from 'moment'

export function shortTime(m: moment.Moment) {
    return m.minutes() > 0 ? m.format('h:mma') : m.format('ha')
}

export function pickupTimeFilterDisplay(searchDate: moment.Moment, long: boolean = false) {
    if (searchDate.isBefore(moment().add(15, 'minutes'))) {
        return 'Now'
    } else {
        let dayStr = long ? 'Today' : ''
        if (searchDate.isSame(moment().add(1, 'days'), 'days')) {
            dayStr = 'Tomorrow'
        } else if (!searchDate.isSame(moment(), 'days')) {
            dayStr = searchDate.format('dddd')
        }
        return `${dayStr}${dayStr.length ? (long ? ', ' : '') : ''} ${searchDate.format('h:mm A')}`
    }
}

export function timeRounded(m: Moment) {
    const remainderMins = m.minutes() % 15
    if (remainderMins !== 0) {
        if (remainderMins < 8) {
            m.subtract(remainderMins, 'minutes')
        } else {
            m.add(15 - remainderMins, 'minutes')
        }
    }

    return m
}
