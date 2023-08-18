import { editInfoWindowsStyles, getGeocodingFromCoordinatesService, getHTHTerritoriesForMapService } from '../../services'
import { generalBlue, typeCoords, typeHTHTerritory, typeRootState } from '../../models'
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { googleMapsAPIKey, mapId } from '../../config'
import { Loading } from '../commons'
import { Modal } from 'react-bootstrap'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export const GeoLocationModal = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: googleMapsAPIKey,
        id: mapId
    })
    const setShowGeolocationModalHandler: Function = props.setShowGeolocationModalHandler
    const map = useRef<any>()
    const [address, setAddress] = useState<string>('')
    const [centerCoords, setCenterCoords] = useState<typeCoords>()
    const [hthTerritories, setHTHTerritories] = useState<typeHTHTerritory[]>()
    const [zoom, setZoom] = useState<number>()

    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition((geoPosition: GeolocationPosition) => {
            getHTHTerritoriesForMapService().then((x: typeHTHTerritory[]|null) => {
                if (x) {
                    setHTHTerritories(x)
                    const interval = setInterval(() => { editInfoWindowsStyles() }, 300)
                    setTimeout(() => { clearInterval(interval) }, 5000)
                }
                const lat: number = geoPosition.coords.latitude
                const lng: number = geoPosition.coords.longitude
                const position: typeCoords = { lat, lng }
                setCenterCoords(position)
                getGeocodingFromCoordinatesService(position).then((address0: string|null) => {
                    if (address0) setAddress(address0)
                })
            })
        })
        return () => {
            setHTHTerritories(undefined)
            setZoom(undefined)
        }
    }, [])

    useEffect(() => {
        // console.log("sss");
        // if (!map.current) return
        // console.log("sss111");
        
        // const locationButton = document.createElement('button')
        // locationButton.textContent = "Pan to Current Location"
        // locationButton.classList.add('d-none')
        // locationButton.classList.add('custom-map-control-button')
        // map.current.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton)
        // locationButton.addEventListener('click', () => {
        //     if (centerCoords) map.current.setCenter(centerCoords)
        // })
        // const interval = setInterval(() => locationButton.click(), 400)
        // setTimeout(() => { clearInterval(interval) }, 4200)
    }, [centerCoords, map])

    return (<>

        {!isLoaded && <Loading />}

        {loadError && <h3> Falló: {loadError.message} </h3>}

        {centerCoords &&
            <Modal
                fullscreen={'md-down'}
                onHide={() => setShowGeolocationModalHandler()}
                show={true}
                size={'lg'}
            >
                <Modal.Header closeButton>
                    <Modal.Title> {address && `Tu posición: ${address.split(',')[0]}`} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GoogleMap
                        id={mapId}
                        mapContainerClassName={isMobile ? 'position-absolute' : 'd-block m-auto'}
                        mapContainerStyle={{
                            height: isMobile ? '600px' : '700px',
                            width: '93%'
                        }}
                        onLoad={(map0: google.maps.Map) => {map.current = map0}}
                        onZoomChanged={() => setZoom(map.current?.getZoom())}
                        options={{ center: centerCoords }}
                        zoom={17.8}
                    >
                        {centerCoords &&
                            <Marker
                                options={{ anchorPoint: new google.maps.Point(centerCoords.lat, centerCoords.lng) }}
                                position={centerCoords}
                                title={"Tu posición"}
                            />
                        }
                        {!!hthTerritories?.length && hthTerritories.map(currentHTHTerritory => (
                            <div key={currentHTHTerritory.territoryNumber}>
                                {currentHTHTerritory.map.polygons.map(currentFace =>
                                    <div key={currentFace.id}>
                                        <Polygon
                                            editable={false}
                                            draggable={false}
                                            path={[currentFace.coordsPoint1, currentFace.coordsPoint2, currentFace.coordsPoint3]}
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
                                                lat: (currentFace.coordsPoint1.lat + currentFace.coordsPoint2.lat + currentFace.coordsPoint3.lat) / 3 + 0.00005,
                                                lng: (currentFace.coordsPoint1.lng + currentFace.coordsPoint2.lng + currentFace.coordsPoint3.lng) / 3 - 0.0001
                                            }}
                                        >
                                            <div style={{
                                                border: '3px solid #ffffff',
                                                borderRadius: '5px',
                                                color: 'white',
                                                display: ((zoom && zoom >= 18) || currentFace.face === 'A') ? '' : 'none',
                                                font: '15px Sans-serif',
                                                fontWeight: 'bold',
                                                height: '36px',
                                                padding: '6px',
                                                textAlign: 'center',
                                                width: '136px'
                                            }}>
                                                {zoom && zoom >= 18 ?
                                                    <span> {currentHTHTerritory.territoryNumber} - {currentFace.block} - {currentFace.face} </span>
                                                    :
                                                    <span> Territorio {currentHTHTerritory.territoryNumber} </span>
                                                }
                                            </div>
                                        </InfoWindow>
                                    </div>
                                )}
                            </div>
                        ))}
                    </GoogleMap>
                </Modal.Body>
            </Modal>
        }
    </>)
}
