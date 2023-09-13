import { typeBlock, typeFace } from './models'

export const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const SERVER = (isLocalhost ?
    'http://localhost:4005'
    :
    'https://misericordia-web-service-3v5m7nxntq-rj.a.run.app'
);

export const pointer = {
    board: `${SERVER}/api/board`,
    campaign: `${SERVER}/api/campaign`,
    config: `${SERVER}/api/config`,
    email: `${SERVER}/api/email`,
    geocoding: `${SERVER}/api/geocoding`,
    houseToHouse: `${SERVER}/api/house-to-house`,
    log: `${SERVER}/api/log`,
    telephonic: `${SERVER}/api/telephonic`,
    user: `${SERVER}/api/user`,
    weather: `${SERVER}/api/weather`
}

export const recaptchaPublicKey = '6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9'

export const hthConfigOptions = {
    blocks: ['1', '2', '3', '4', '5', '6'] as typeBlock[],
    faces: ['A', 'B', 'C', 'D', 'E', 'F'] as typeFace[],
    buildingDoorNumbers: Array.from({ length: 30 }, (_, i) => i + 1),  // 1-30
    buildingLevels: Array.from({ length: 51 }, (_, i) => i)  // PB-50
}

export const userGroups = Array.from({ length: 6 }, (_, i) => i + 1);

export const googleMapConfig = {
    googleMapsApiKey: isLocalhost ? 'AIzaSyCWWH0mdRMiQ2fIsWD_xcV7AqXCyQVg594' : 'AIzaSyBPcwNALtiEb3_s-mHvS8R5WxBb_jyRYhE',
    id: 'ad09b84d2db0b86d',
    libraries: ['maps', 'places'] as any,
    region: 'AR',
    language: 'es'
}

export const placesBounds = {
    east: -58.353243,
    north: -34.562694,
    south: -34.705957,
    west: -58.530468
}

export const initCoordinates = { lat: -34.6258549, lng: -58.4343211 }

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
