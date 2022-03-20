import { getTokenService } from './tokenServices'

export const isLocalhost: boolean = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

export const timeConverter = (UNIX_timestamp: string, parse: boolean): string => {
    try {
        let a: Date;
        if (parse) a = new Date(parseInt(UNIX_timestamp))
        else a = new Date(UNIX_timestamp)
        let months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
        let year = a.getFullYear()
        let month = months[a.getMonth()]
        let date = a.getDate()
        let hour = a.getHours()
        let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes()
        let time = date + ' ' + month + ' ' + year + ' - ' + hour + ':' + min + ' hs'
        return time
    } catch { return "No se pudo recuperar la fecha..." }
}

export const putHyphens = (phoneNumber: number): string => {
    if (!phoneNumber) return ""
    let phoneNumberStr = phoneNumber.toString()
    if (phoneNumberStr.length < 7) return phoneNumberStr
    if (phoneNumberStr[0] === "1") return phoneNumberStr.slice(0,2) + "-" + phoneNumberStr.slice(2,6) + "-" + phoneNumberStr.slice(-4)    // mobile
    if (phoneNumberStr.slice(0,3) === "223") return "223-" + phoneNumberStr.slice(3,6) + "-" + phoneNumberStr.slice(6,10)    // campaign
    if (phoneNumberStr.slice(0,4) === "2284") return "2284-" + phoneNumberStr.slice(4,7) + "-" + phoneNumberStr.slice(7,10)    // campaign
    return phoneNumberStr.slice(0,3) + "-" + phoneNumberStr.slice(3,6) + "-" + phoneNumberStr.slice(-4)    // house
}

export const isMobile: boolean = window.screen.width < 990 ? true : false

export const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'authorization': getTokenService() || 'abcdefghi0123456789'
}
