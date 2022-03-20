export const recaptchaPublicKey = "6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9"

const isLocalhost: boolean = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

export const SERVER: string = isLocalhost ? "http://localhost:4005" : "https://registros-rest-api.herokuapp.com"

// production server will not respond because newer cors policies
