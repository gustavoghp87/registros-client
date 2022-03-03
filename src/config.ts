import { isLocalhost } from "./services/functions"

export const recaptchaPublicKey = "6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9"

let local = true
if (!isLocalhost) local = false
export const SERVER: string = local ? "http://localhost:4005" : "https://registros-rest-api.herokuapp.com"

// production server will not respond because newer cors policies
