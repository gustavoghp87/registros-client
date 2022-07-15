import Geocode from 'react-geocode'
import { useEffect, useRef, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { generalBlue } from '../_App'
import { Loading } from '../commons/Loading'
import { typeRootState } from '../../store/store'
import { googleMapsAPIDevelopmentKey, googleMapsAPIProductionKey, mapId } from '../../config'
import { isLocalhost } from '../../services/functions'
import { typeCoords, typeHTHTerritory, typePolygon } from '../../models/houseToHouse'
import { getHTHTerritoryService } from '../../services/houseToHouseServices'

export const GeoLocationModal = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey,
        id: mapId
    })
    const setShowGeolocationModalHandler: Function = props.setShowGeolocationModalHandler
    const map = useRef<google.maps.Map>()
    const [address, setAddress] = useState<string>('')
    const [centerCoords, setCenterCoords] = useState<typeCoords>()
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>()
    const [polygons, setPolygons] = useState<typePolygon[]>()

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log("No geo")
            return
        }
        let infoWindow0: google.maps.InfoWindow = new google.maps.InfoWindow()
        navigator.geolocation.getCurrentPosition((geoPosition: GeolocationPosition) => {
            const lat: number = geoPosition.coords.latitude
            const lng: number = geoPosition.coords.longitude
            const position: typeCoords = { lat, lng }
            infoWindow0.setPosition(position)
            // infoWindow0.setContent("Location found.");
            setInfoWindow(infoWindow0)
            setCenterCoords(position)
            Geocode.setApiKey(isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey)
            Geocode.setLanguage('es')
            Geocode.setRegion('arg')
            Geocode.setLocationType('ROOFTOP')    // ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE
            if (isLocalhost) Geocode.enableDebug()
            Geocode.fromLatLng(lat.toString(), lng.toString()).then((response) => {
                const address0 = response.results[0].formatted_address
                console.log(address0)
                setAddress(address0)
            }, (error) => {
                console.log(error)
            })
        })
        for (let i = 1; i < 57; i++) {
            getHTHTerritoryService(i.toString()).then((hthTerritory0: typeHTHTerritory|null) => {
                if (hthTerritory0 && hthTerritory0.map.polygons && hthTerritory0.map.polygons.length)
                    hthTerritory0.map.polygons.forEach(x => setPolygons(y => y ? [...y, x] : [x]))
            })
        }
    }, [])

    useEffect(() => {
        if (!map.current) return
        const locationButton = document.createElement('button')
        locationButton.textContent = "Pan to Current Location"
        locationButton.classList.add('d-none')
        locationButton.classList.add('custom-map-control-button')
        map.current.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton)
        locationButton.addEventListener('click', () => {
            if (centerCoords) map.current?.setCenter(centerCoords)
        })
        const interval = setInterval(() => locationButton.click(), 500)
        setTimeout(() => { clearInterval(interval) }, 2200)
    }, [map.current])

    return (<>

        {!isLoaded && <Loading />}

        {loadError && <h3> Falló: {loadError.message} </h3>}

        {centerCoords && infoWindow &&
            <Modal
                fullscreen={'md-down'}
                onHide={() => setShowGeolocationModalHandler()}
                show={true}
                size={'lg'}
            >
                <Modal.Header closeButton>
                    <Modal.Title> {address && `Tu posición: ${address}`} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GoogleMap
                        id={mapId}
                        mapContainerClassName={isMobile ? 'position-absolute' : 'd-block m-auto'}
                        mapContainerStyle={{
                            height: isMobile ? '600px' : '700px',
                            width: '93%'
                        }}
                        onLoad={(map0: google.maps.Map) => { map.current = map0 } }
                        options={{ center: centerCoords }}
                        zoom={17.8}
                    >
                        {polygons && !!polygons.length && polygons.map(x => (
                            <div key={x.id}>
                                <Polygon
                                    editable={false}
                                    draggable={false}
                                    path={[x.coordsPoint1, x.coordsPoint2, x.coordsPoint3]}
                                    options={{
                                        clickable: true,
                                        fillColor: generalBlue,
                                        fillOpacity: 0.9,
                                        strokeColor: '',
                                        strokeOpacity: 0.8,
                                        strokePosition: google.maps.StrokePosition.INSIDE,
                                        strokeWeight: 7
                                    }}
                                />
                                <InfoWindow
                                    position={{
                                        lat: (x.coordsPoint1.lat + x.coordsPoint2.lat + x.coordsPoint3.lat) / 3 + 0.00005,
                                        lng: (x.coordsPoint1.lng + x.coordsPoint2.lng + x.coordsPoint3.lng) / 3 - 0.0001
                                    }}
                                >
                                    <div style={{
                                        border: '3px solid #ffffff',
                                        borderRadius: '5px',
                                        color: '#ffffff',
                                        font: '15px Sans-serif',
                                        fontWeight: 'bold',
                                        height: '36px',
                                        padding: '6px',
                                        textAlign: 'center',
                                        width: '56px'
                                    }}>
                                        {x.block}-{x.face}
                                    </div>
                                </InfoWindow>
                            </div>
                        ))}
                        {centerCoords &&
                            <Marker
                                title={"Tu posición"}
                                position={centerCoords}
                            />
                        }
                    </GoogleMap>
                </Modal.Body>
            </Modal>
        }
    </>)
}
