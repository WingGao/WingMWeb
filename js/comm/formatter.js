const numeral = require('numeral')
const moment = require('moment')

const CN_DATE = 'YYYY-MM-DD'
const CN_DATETIME = 'YYYY-MM-DD HH:mm:ss'

/**
 * 格式化字符串到 人民币
 * @param {*} y 金额 10000.01
 * @return {string} '10,000.01'
 */
function cny(y) {
    return numeral(y).format('0,0[.]00')
}

/**
 * unix时间转成YYYY-MM-DD
 * @param {*} unix
 */
function unixToDate(unix) {
    return moment.unix(unix).format(CN_DATE)
}

function unixToDatetime(unix) {
    return moment.unix(unix).format(CN_DATETIME)
}

function toBool(v) {
    if (v === true || v === 'true' || v === '1' || v === 1) {
        return true;
    }
    return false;
}

const formatter = {
    cny, unixToDate, unixToDatetime, toBool
}

export default formatter
