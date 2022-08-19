import { typeBlock, typeHousehold, typeHTHTerritory } from '../models'

type typeHeaders = {
    'Accept': string
    'Content-Type': string
    'x-Authorization': string
    'x-Recaptcha-Token': string
}

export const getHeaders = (): typeHeaders => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-Authorization': localStorage.getItem('token') || "",
    'x-Recaptcha-Token': localStorage.getItem('recaptchaToken') || ""
})

export const timeConverter = (UNIX_timestamp: number): string => {
    try {
        let a: Date = new Date(UNIX_timestamp)
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
        return "Error en la fecha..."
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

export const insertAnimationForAlertModal = (animationNumber: number): NodeJS.Timeout => setTimeout((): void => {
    if (!animationNumber) return
    const tag = document.createElement('img')
    if (animationNumber === 1)
        tag.src = 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flat_tick_icon.svg'
    else if (animationNumber === 2)
        tag.src = 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flat_cross_icon.svg'
    else
        return
    tag.alt = "Failed"
    tag.classList.add('w-50')
    tag.classList.add('pb-3')
    tag.classList.add('animate__animated')
    tag.classList.add('animate__heartBeat')
    const bodyElements: HTMLCollectionOf<Element> = document.getElementsByClassName('react-confirm-alert-body')
    bodyElements[0]?.prepend(tag)
}, 200)

export const editInfoWindowsStyles = (): NodeJS.Timeout => setTimeout((): void => {
    const elements = document.getElementsByClassName('gm-ui-hover-effect') as HTMLCollectionOf<HTMLElement>
    const v = document.getElementsByClassName('gm-style-iw-tc') as HTMLCollectionOf<HTMLElement>
    const w = document.getElementsByClassName('gm-style-iw-a') as HTMLCollectionOf<HTMLElement>
    const x = document.getElementsByClassName('gm-style-iw gm-style-iw-c') as HTMLCollectionOf<HTMLElement>
    const y = document.getElementsByClassName('gm-style-iw-d') as HTMLCollectionOf<HTMLElement>
    const z = document.getElementsByClassName('gm-style-iw-t') as HTMLCollectionOf<HTMLElement>
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('d-none')
    }
    for (let i = 0; i < v.length; i++) {
        v[i].classList.remove('gm-style-iw-tc')
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
        if (x.callingState === 'No predicado') x = { ...x, variant: 'success' }
        else if (x.callingState === 'Contestó') x = { ...x, variant: 'primary' }
        else if (x.callingState === 'No contestó') x = { ...x, variant: 'warning' }
        else if (x.callingState === 'A dejar carta') x = { ...x, variant: 'danger' }
        else if (x.callingState === 'No llamar') x = { ...x, variant: 'dark' }
        return x
    })
}

export const getHouseholdsToShow = (households: typeHousehold[],
 currentBlock: typeBlock, isShowingAllStates: boolean, isShowingAllAvailable: boolean): typeHousehold[] => {
    if (isShowingAllStates && isShowingAllAvailable) {
        households = households.filter(x =>
            x.block === currentBlock
        )
    } else if (!isShowingAllStates && isShowingAllAvailable) {
        households = households.filter(x =>
            x.block === currentBlock && ((x.callingState === 'No predicado' && x.notSubscribed !== true) || x.doNotMove)
        )
    } else if (isShowingAllStates && !isShowingAllAvailable) {
        households = households.filter(x =>
            x.block === currentBlock
        )
    } else {
        households = households.filter(x =>
            x.block === currentBlock && ((x.callingState === 'No predicado' && x.notSubscribed !== true) || x.doNotMove)
        )
    }
    return households
}

export const getNumberOfFreePhones = (households: typeHousehold[]): number => {
    return households.filter(x => !x.notSubscribed && x.callingState === 'No predicado').length
}

export const getBlocks = (households: typeHousehold[]): typeBlock[] => {
    let blocks: typeBlock[] = []
    for (let i = 1; i < 10; i++) {
        if (households.some(x => x.block === i.toString())) blocks.push(i.toString() as typeBlock)
    }
    return blocks
}

export const getStreetsByHTHTerritory = (hthTerritory: typeHTHTerritory): string[] => {
    if (!hthTerritory || !hthTerritory.map || !hthTerritory.map.polygons) return []
    const streets: string[] = []
    hthTerritory.map.polygons.forEach(x => {
        if (!streets.includes(x.street)) streets.push(x.street)
    })
    return streets
}
