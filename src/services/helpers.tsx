import { aDejarCarta, contesto, danger, dark, noContesto, noLlamar, noPredicado, primary, success, typeHousehold, warning } from '../models'

type typeHeaders = {
    'Accept': string
    'Authorization': string
    'Content-Type': string
}

export const headers: typeHeaders = {
    'Accept': 'application/json',
    'Authorization': localStorage.getItem('token') || "",
    'Content-Type': 'application/json'
}

export const timeConverter = (UNIX_timestamp: string, parse: boolean): string => {
    try {
        let a: Date;
        if (parse) a = new Date(parseInt(UNIX_timestamp))
        else a = new Date(UNIX_timestamp)
        let months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        let year = a.getFullYear()
        let month = months[a.getMonth()]
        let date = a.getDate()
        let hour = a.getHours()
        let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes()
        let time = date + " " + month + " " + year + " - " + hour + ":" + min + " hs"
        return time
    } catch (error) {
        console.log(error)
        return "No se pudo recuperar la fecha..."
    }
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

export const getReducedPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber || phoneNumber.length < 7) return phoneNumber
    if (phoneNumber.substring(0, 6) === "54-11-") return phoneNumber.substring(6)
    if (phoneNumber.substring(0, 3) === "54-") return phoneNumber.substring(3)
    return phoneNumber
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

export const editInfoWindowsStyles = (): NodeJS.Timeout => setTimeout((): void => {
    const elements = document.getElementsByClassName('gm-ui-hover-effect') as HTMLCollectionOf<HTMLElement>
    const w = document.getElementsByClassName('gm-style-iw-a') as HTMLCollectionOf<HTMLElement>
    const x = document.getElementsByClassName('gm-style-iw gm-style-iw-c') as HTMLCollectionOf<HTMLElement>
    const y = document.getElementsByClassName('gm-style-iw-d') as HTMLCollectionOf<HTMLElement>
    const z = document.getElementsByClassName('gm-style-iw-t') as HTMLCollectionOf<HTMLElement>
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('d-none')
    }
    for (let i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = 'transparent'
        if (x[i] && x[i].classList.contains('gm-style-iw-c')) {
            x[i].classList.remove('gm-style-iw-c')
        }
    }
    for (let i = 0; i < y.length; i++) {
        y[i].style.backgroundColor = 'transparent'
        y[i].style.overflow = 'hidden'
        const a = y[i] as HTMLElement
        let b
        let c
        if (a) b = a.firstChild as HTMLElement
        if (b) c = b.firstChild as HTMLElement
        if (c) {
            c.style.background = 'none'
            c.style.cursor = 'pointer'
        }
    }
    for (let i = 0; i < w.length; i++) {
        w[i].classList.remove('gm-style-iw-a')
    }
    for (let i = 0; i < z.length; i++) {
        z[i].classList.remove('gm-style-iw-t')
    }
}, 500)

export const getHouseholdVariant = (households: typeHousehold[]): typeHousehold[] => {
    if (!households || !households.length) return households
    return households.map(x => {
        if (x.estado === noPredicado) x = { ...x, variante: success }
        if (x.estado === contesto) x = { ...x, variante: primary }
        if (x.estado === noContesto) x = { ...x, variante: warning }
        if (x.estado === aDejarCarta) x = { ...x, variante: danger }
        if (x.estado === noLlamar) x = { ...x, variante: dark }
        return x
    })
}
