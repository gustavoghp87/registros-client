import { getTokenFromLSService } from './localStorageServices'

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

export const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'authorization': getTokenFromLSService() || ""
}

export const adjustModalStyles = (): NodeJS.Timeout => setTimeout((): void => {
    const bodyElements: HTMLCollectionOf<Element> = document.getElementsByClassName('react-confirm-alert-body')
    bodyElements[0]?.classList?.add('text-center')
    bodyElements[0]?.firstElementChild?.classList?.add('h3')
    bodyElements[0]?.firstElementChild?.classList?.add('mb-3')
    const buttonGroupElements: HTMLCollectionOf<Element> = document.getElementsByClassName('react-confirm-alert-button-group')
    buttonGroupElements[0]?.classList?.add('d-block')
    buttonGroupElements[0]?.classList?.add('m-auto')
    buttonGroupElements[0]?.classList?.add('mt-4')
    buttonGroupElements[0]?.firstElementChild?.classList?.add('bg-danger')
}, 200)
