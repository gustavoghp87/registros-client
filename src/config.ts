
const isLocalhost: boolean = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)
    
export const SERVER: string = isLocalhost ? "http://localhost:4005" : "https://registros-rest-api.herokuapp.com"
// production server will not respond because newer cors policies
export const recaptchaPublicKey = "6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9"
export const mapId: string = "ad09b84d2db0b86d"
export const googleMapsAPIDevelopmentKey: string = "AIzaSyCWWH0mdRMiQ2fIsWD_xcV7AqXCyQVg594"
export const googleMapsAPIProductionKey: string = "AIzaSyBPcwNALtiEb3_s-mHvS8R5WxBb_jyRYhE"
export const googleGeocodingAPIProductionKey: string = "AIzaSyAYoQHRo2P7xx739t85Txk24lbSnrcFIOI"
