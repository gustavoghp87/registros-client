import { editInfoWindowsStyles, getGeocodingFromCoordinatesService, getHTHTerritoriesForMapService } from '../../services'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { generalBlue } from '../../constants'
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { googleMapsApiKey, mapId } from '../../app-config'
import { Loading } from '../commons'
import { Modal } from 'react-bootstrap'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeCoords, typeHTHTerritory, typeRootState } from '../../models'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

type propsType = {
    setShowGeolocationModalHandler: () => void
}

export const GeoLocationModal: FC<propsType> = ({ setShowGeolocationModalHandler }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey,
        id: mapId,
        libraries: ['maps', 'places'],
        region: 'AR',
        language: 'es'
    })
    const isMobile = useSelector((state: typeRootState) => state.mobileMode.isMobile)
    const [address, setAddress] = useState("")
    const [centerCoords, setCenterCoords] = useState<typeCoords|null>(null)
    const [hthTerritories, setHTHTerritories] = useState<typeHTHTerritory[]|null>(null)
    const [zoom, setZoom] = useState(0)
    const dispatch = useDispatch()
    const map = useRef<any>()
    const navigate = useNavigate()

    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition((geoPosition: GeolocationPosition) => {
            if (!geoPosition) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Error",
                    message: "Algo falló al geolocalizar"
                }))
                return
            }
            getHTHTerritoriesForMapService().then((x: typeHTHTerritory[]|null) => {
                if (!x) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Error",
                        message: "No se obtuvieron los territorios"
                    }))
                    return
                }
                setHTHTerritories(x)
                const interval = setInterval(() => { editInfoWindowsStyles() }, 300)
                setTimeout(() => { clearInterval(interval) }, 5000)
                const position: typeCoords = {
                    lat: geoPosition.coords.latitude,
                    lng: geoPosition.coords.longitude
                }
                setCenterCoords(position)
                getGeocodingFromCoordinatesService(position).then((address0: string|null) => {
                    if (!address0) {
                        setAddress("-,")
                        return
                    }
                    setAddress(address0)
                })
            })
        })
    }, [])

    // useEffect(() => {
        // if (!map.current) return
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
    // }, [centerCoords, map])

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
                        center={centerCoords}
                        zoom={17.8}
                        onZoomChanged={() => setZoom(map.current?.getZoom())}
                        // options={{ center: centerCoords, zoom: zoom }}
                        // zoom={zoom}
                    >
                        {centerCoords &&
                            <Marker
                                options={{ anchorPoint: new google.maps.Point(centerCoords.lat, centerCoords.lng) }}
                                position={centerCoords}
                                title={"Tu posición"}
                            />
                        }
                        {!!hthTerritories?.length && hthTerritories.map(t => (
                            <div key={t.territoryNumber}>
                                {t.map.polygons.map(currentFace =>
                                    <Fragment key={currentFace.id}>
                                        <Polygon
                                            editable={false}
                                            draggable={false}
                                            path={[currentFace.coordsPoint1, currentFace.coordsPoint2, currentFace.coordsPoint3]}
                                            onClick={() => navigate(`/casa-en-casa/${t.territoryNumber}?b=${currentFace.block}&f=${currentFace.face}`)}
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
                                                    <span> {t.territoryNumber} - {currentFace.block} - {currentFace.face} </span>
                                                    :
                                                    <span> Territorio {t.territoryNumber} </span>
                                                }
                                            </div>
                                        </InfoWindow>
                                    </Fragment>
                                )}
                            </div>
                        ))}
                    </GoogleMap>
                </Modal.Body>
            </Modal>
        }
    </>)
}
