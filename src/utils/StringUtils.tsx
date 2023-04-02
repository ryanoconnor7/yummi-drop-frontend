export function objToQueryString(obj) {
    const keyValuePairs = Object.keys(obj).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })

    return keyValuePairs.join('&')
}
