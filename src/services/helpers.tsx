import { typeBlock, typeCoords, typeFace, typeHousehold, typeHTHBuilding, typeHthComplexBuildingItem, typeHthNewComplexBuildingItem, typeHTHTerritory } from '../models'

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

export const timeConverter = (UNIX_timestamp: number, withHour: boolean = true): string => {
    try {
        const a: Date = new Date(UNIX_timestamp)
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        const year = a.getFullYear()
        const month = months[a.getMonth()]
        const date = a.getDate()
        const hour = a.getHours()
        const min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes()
        let time: string
        if (withHour) {
            time = date + " " + month + " " + year + " - " + hour + ":" + min + " hs"
        } else {
            time = date + " " + month + " " + year
        }
        return time
    } catch (error) {
        console.log(error)
        return "Error en la fecha..."
    }
}

export const getCurrentLocalDate = (timestamp?: number) => {
    const argDate = timestamp ? new Date(timestamp) : new Date();
    argDate.setTime(argDate.getTime() - 3 * 60 * 60 * 1000);
    return argDate.toISOString().split('T')[0]
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
        // tag.src = 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flat_tick_icon.svg'
        tag.src = '../../svg_ok.svg';
    else if (animationNumber === 2)
        // tag.src = 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flat_cross_icon.svg'
        tag.src = '../../svg_fail.svg'
    else if (animationNumber === 3)
        tag.src = '../../svg_warning.svg'
    else if (animationNumber === 4)
        // tag.src = 'https://pic.onlinewebfonts.com/svg/img_570882.png'
        tag.src = '../../card.png'
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
    let householdsToShow = [ ...households ]
    if (isShowingAllStates && isShowingAllAvailable) {
        householdsToShow = householdsToShow.filter(x =>
            x.block === currentBlock
        )
    } else if (!isShowingAllStates && isShowingAllAvailable) {
        householdsToShow = householdsToShow.filter(x =>
            x.block === currentBlock && ((x.callingState === 'No predicado' && x.notSubscribed !== true) || x.doNotMove)
        )
    } else if (isShowingAllStates && !isShowingAllAvailable) {
        householdsToShow = householdsToShow.filter(x =>
            x.block === currentBlock
        )
    } else {
        householdsToShow = householdsToShow.filter(x =>
            x.block === currentBlock && ((x.callingState === 'No predicado' && x.notSubscribed !== true) || x.doNotMove)
        )
    }
    return householdsToShow
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
        if (x.street && !streets.includes(x.street)) streets.push(x.street)
    })
    return streets
}

const getCharacterForNumber = (numberToChange: number, hasNn: boolean = false): string => {  // String.fromCharCode(65 + apartmentNumber)}
    if (numberToChange === 1) return 'A'
    if (numberToChange === 2) return 'B'
    if (numberToChange === 3) return 'C'
    if (numberToChange === 4) return 'D'
    if (numberToChange === 5) return 'E'
    if (numberToChange === 6) return 'F'
    if (numberToChange === 7) return 'G'
    if (numberToChange === 8) return 'H'
    if (numberToChange === 9) return 'I'
    if (numberToChange === 10) return 'J'
    if (numberToChange === 11) return 'K'
    if (numberToChange === 12) return 'L'
    if (numberToChange === 13) return 'M'
    if (numberToChange === 14) return 'N'
    if (numberToChange === 15) return hasNn ? 'Ñ' : 'O'
    if (numberToChange === 16) return hasNn ? 'O' : 'P'
    if (numberToChange === 17) return hasNn ? 'P' : 'Q'
    if (numberToChange === 18) return hasNn ? 'Q' : 'R'
    if (numberToChange === 19) return hasNn ? 'R' : 'S'
    if (numberToChange === 20) return hasNn ? 'S' : 'T'
    if (numberToChange === 21) return hasNn ? 'T' : 'U'
    if (numberToChange === 22) return hasNn ? 'U' : 'V'
    if (numberToChange === 23) return hasNn ? 'V' : 'W'
    if (numberToChange === 24) return hasNn ? 'W' : 'X'
    if (numberToChange === 25) return hasNn ? 'X' : 'Y'
    if (numberToChange === 26) return hasNn ? 'Y' : 'Z'
    if (numberToChange === 27) return hasNn ? '?' : 'Z'
    return '?'
}

const getNumberForLetter = (letterToChange: string): number => {
    if (letterToChange === 'A') return 1
    if (letterToChange === 'B') return 2
    if (letterToChange === 'C') return 3
    if (letterToChange === 'D') return 4
    if (letterToChange === 'E') return 5
    if (letterToChange === 'F') return 6
    if (letterToChange === 'G') return 7
    if (letterToChange === 'H') return 8
    if (letterToChange === 'I') return 9
    if (letterToChange === 'J') return 10
    if (letterToChange === 'K') return 11
    return 0
}

export const maskTheBlock = (block: typeBlock, usingLettersForBlock: boolean): typeBlock|string => (
    usingLettersForBlock ? getCharacterForNumber(parseInt(block)) : block
);

export const maskTheFace = (face: typeFace, usingLettersForBlock: boolean): typeFace|number => (
    usingLettersForBlock ? getNumberForLetter(face) : face
);

export const getHouseholdDoorBell = (doorNumber: number, index: number, index1: number,
 hasContinuousNumbers: boolean, hasCharacters: boolean, numberPerLevel: number, hasNn: boolean): string => {
    if (hasContinuousNumbers) {
        if (hasCharacters) return getCharacterForNumber(index*numberPerLevel + index1 + 1, hasNn)
        return (index*numberPerLevel + index1 + 1).toString()
    } else {
        if (hasCharacters) return getCharacterForNumber(doorNumber, hasNn)
        return doorNumber.toString()
    }
}

export const getFreeHouseholds = (building: typeHTHBuilding): number => {
    if (!building.households?.length) return 0
    const rest = building.households.filter(x => !x.isChecked).length
    if (!!building.manager) {
        return !!building.manager.isChecked ? rest : rest + 1
    }
    return rest
}

export const getHthComplexBuilding = (currentBuilding: typeHTHBuilding): typeHthComplexBuildingItem[][] => (
    Array.from({ length: currentBuilding.numberPerLevel }, (_, door) =>
        Array.from({ length: currentBuilding.numberOfLevels }, (_, level) => ({
            id: `item-${level + door}-${new Date().getTime()}`,
            household: currentBuilding.households.find(h => h.level === level && h.doorNumber === door) || null
        })
    ))
);

export const getHthNewComplexBuilding = (numberOfLevels: number, numberPerLevel: number): typeHthNewComplexBuildingItem[][] => (
    Array.from({ length: numberPerLevel }, (_, door) => (
        Array.from({ length: numberOfLevels }, (_, level) => ({
            id: `item-${level + door}-${new Date().getTime()}`,
            label: `Fila ${level + 1} Columna ${door + 1}`
        }))
    ))
);

export const generateRandomEmail = () => {
    const domains = ['gmailx.com', 'yahoox.com', 'outlookx.com', 'examplex.com', 'randommailx.net']
    const randomDomainIndex = Math.floor(Math.random() * domains.length)
    const usernameLength = Math.floor(Math.random() * 10) + 5
    const username = Array.from({ length: usernameLength }, () => Math.random().toString(36).charAt(2)).join('')
    const email = `${username}@${domains[randomDomainIndex]}`
    return email
}

export const goToTop = () => window.scrollTo(0, 0);

const getCenter = (coordinates: typeCoords[]): typeCoords => {
    let sumLat = 0
    let sumLng = 0
    for (const coordinate of coordinates) {
        sumLat += coordinate.lat
        sumLng += coordinate.lng
    }
    const numberOfCoordinates = coordinates.length
    const lat = sumLat / numberOfCoordinates
    const lng = sumLng / numberOfCoordinates
    return { lat, lng }
}

export const getPolygonCoordinates = (numberOfCoordinate: number, numberOfPolygon: number, blockCoordinates?: typeCoords[]) => {
    const coordinate: typeCoords = {
        lat: 0,
        lng: 0
    }
    if (!blockCoordinates) return coordinate
    const center: typeCoords = getCenter(blockCoordinates)
    if (numberOfCoordinate === 3) return center
    if (numberOfPolygon === 1) {
        if (numberOfCoordinate === 1) {
            coordinate.lat = blockCoordinates[0].lat
            coordinate.lng = blockCoordinates[0].lng
        } else if (numberOfCoordinate === 2) {
            coordinate.lat = blockCoordinates[1].lat
            coordinate.lng = blockCoordinates[1].lng
        }
    } else if (numberOfPolygon === 2) {
        if (numberOfCoordinate === 1) {
            coordinate.lat = blockCoordinates[1].lat
            coordinate.lng = blockCoordinates[1].lng
        } else if (numberOfCoordinate === 2) {
            coordinate.lat = blockCoordinates[2].lat
            coordinate.lng = blockCoordinates[2].lng
        }
    } else if (numberOfPolygon === 3) {
        if (numberOfCoordinate === 1) {
            coordinate.lat = blockCoordinates[2].lat
            coordinate.lng = blockCoordinates[2].lng
        } else if (numberOfCoordinate === 2) {
            coordinate.lat = blockCoordinates[3].lat
            coordinate.lng = blockCoordinates[3].lng
        }
    } else if (numberOfPolygon === 4) {
        if (numberOfCoordinate === 1) {
            coordinate.lat = blockCoordinates[3].lat
            coordinate.lng = blockCoordinates[3].lng
        } else if (numberOfCoordinate === 2) {
            coordinate.lat = blockCoordinates[0].lat
            coordinate.lng = blockCoordinates[0].lng
        }
    }
    return coordinate
}

export const getMiddlePointOfCoordinates = (coordinates1: typeCoords, coordinates2: typeCoords): typeCoords => {
    const middlePointCoordinates = {
        lat: (coordinates1.lat + coordinates2.lat) / 2,
        lng: (coordinates1.lng + coordinates2.lng) / 2
    }
    return middlePointCoordinates
}

export const sortCoordinatesClockwise = (coordinates: typeCoords[]) => {
    let closestPoint = coordinates[0]
    let shortestDistance = Math.abs(closestPoint.lat) + Math.abs(closestPoint.lng)
    for (const point of coordinates) {
        const distance = Math.abs(point.lat) + Math.abs(point.lng);
        if (distance < shortestDistance) {
            closestPoint = point
            shortestDistance = distance
        }
    }
    const sortedPoints = coordinates
        .filter((point: typeCoords) => point !== closestPoint)
        .sort((a: typeCoords, b: typeCoords) => {
            const angleA = Math.atan2(a.lat - closestPoint.lat, a.lng - closestPoint.lng)
            const angleB = Math.atan2(b.lat - closestPoint.lat, b.lng - closestPoint.lng)
            return angleB - angleA
        })
    sortedPoints.unshift(closestPoint)
    return sortedPoints
}
