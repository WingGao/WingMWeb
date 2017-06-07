import moment from 'moment'
//https://momentjs.com/docs/#/get-set/
export const CN_FORMATTER = 'YYYY-MM-DD HH:mm:ss'
export function unixToMoment(unix) {
    return moment(unix, 'X')
}