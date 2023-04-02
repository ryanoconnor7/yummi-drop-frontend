import moment from 'moment'

export function shortTime(m: moment.Moment) {
    return m.minutes() > 0 ? m.format('h:mma') : m.format('ha')
}

export function pickupTimeFilterDisplay(searchDate: moment.Moment) {
    if (searchDate.isBefore(moment().add(15, 'minutes'))) {
        return 'Now'
    } else {
        let dayStr = ''
        if (searchDate.isSame(moment().add(1, 'days'), 'days')) {
            dayStr = 'Tomorrow '
        } else if (!searchDate.isSame(moment(), 'days')) {
            dayStr = searchDate.format('dddd')
        }
        return `${dayStr} ${searchDate.format('h:mm A')}`
    }
}
