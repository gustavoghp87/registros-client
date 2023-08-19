const isLocalhost: boolean = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const SERVER: string = (isLocalhost ?
    "http://localhost:4005"
    :
    "https://misericordia-web-service-3v5m7nxntq-rj.a.run.app"  // production server will not respond to local because cors policies
    // "https://misericordiawebapi-ghp2120.b4a.run"
);

export const pointer = {
    board: `${SERVER}/api/board`,
    campaign: `${SERVER}/api/campaign`,
    email: `${SERVER}/api/email`,
    houseToHouse: `${SERVER}/api/house-to-house`,
    geocoding: `${SERVER}/api/geocoding`,
    log: `${SERVER}/api/log`,
    telephonic: `${SERVER}/api/telephonic`,
    user: `${SERVER}/api/user`,
    weather: `${SERVER}/api/weather`
}

export const recaptchaPublicKey = "6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9"

export const mapId: string = "ad09b84d2db0b86d"

export const googleMapsApiKey: string = isLocalhost ? "AIzaSyCWWH0mdRMiQ2fIsWD_xcV7AqXCyQVg594" : "AIzaSyBPcwNALtiEb3_s-mHvS8R5WxBb_jyRYhE"


///////// NEW PROJECT:

// GET: () => { success: boolean, allLogsObj: typeAllLogsObj }

type service = {
    name: string
    url: string
    method: RequestInit["method"]
    body: any
    response: { data: any }
}

type pointerItem = {
    path: string,
    services: service[]
}

type typePointer = {
    board: pointerItem
    campaign: pointerItem
    email: pointerItem
    houseToHouse: pointerItem
    geocoding: pointerItem
    log: pointerItem
    telephonic: pointerItem
    user: pointerItem
}

export const pointer1: typePointer = {
    board: {
        path: `${SERVER}/api/board`,
        services: [

        ],
    },
    campaign: {
        path: `${SERVER}/api/campaign`,
        services: [
            {
                name: 'askForANewCampaignPackService',
                url: '/new-pack',
                method: 'POST',
                body: {},
                response: { data: { success: false } }
            },
            {
                name: 'assignCampaignPackByEmailService',
                url: '/:id',
                method: 'PUT',
                body: { email: '' },
                response: { data: { success: true } }
            }
        ]
    },
    email: {
        path: `${SERVER}/api/email`,
        services: [

        ],
    },
    houseToHouse: {
        path: `${SERVER}/api/house-to-house`,
        services: [

        ],
    },
    geocoding: {
        path: `${SERVER}/api/geocoding`,
        services: [

        ],
    },
    log: {
        path: `${SERVER}/api/log`,
        services: [

        ],
    },
        // GET: () => { success: boolean, allLogsObj: typeAllLogsObj }
    telephonic: {
        path: `${SERVER}/api/telephonic`,
        services: [

        ],
    },
    user: {
        path: `${SERVER}/api/user`,
        services: [

        ],
    }
}
