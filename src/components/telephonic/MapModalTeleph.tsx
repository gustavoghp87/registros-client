import { FC, useEffect, useState } from 'react'
import { getGeocodingFromAddressService } from '../../services'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { googleMapConfig } from '../../app-config'
import { Loading } from '../commons'
import { Modal } from 'react-bootstrap'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeCoords, typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    address: string
    hideGoogleMapHandler: () => void
}
 
export const MapModalTeleph: FC<propsType> = ({ address, hideGoogleMapHandler }) => {
    const isMobile = useSelector((state: typeRootState) => state.mobileMode.isMobile)
    const { isLoaded, loadError } = useJsApiLoader(googleMapConfig)
    const [centerCoords, setCenterCoords] = useState<typeCoords>()
    const dispatch = useDispatch()

    useEffect(() => {
        const target: string = address + " CABA"
        getGeocodingFromAddressService(target).then((coordinates: typeCoords|null) => {
            if (!coordinates?.lat || !coordinates?.lng) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    title: 'Error',
                    message: "Falló el servicio de geolocalización",
                    mode: 'alert',
                    animation: 2
                }))
                return
            }
            setCenterCoords({ lat: coordinates.lat, lng: coordinates.lng })
        })
        return () => setCenterCoords(undefined)
    }, [address, dispatch])

    return (<>

        {!isLoaded && <Loading />}

        {loadError && <h3> Falló: {loadError.message} </h3>}

        {centerCoords && <>
            <h1>HAAA</h1>
            <Modal
                fullscreen={'md-down'}
                onHide={() => hideGoogleMapHandler()}
                show={!!centerCoords}
                size={'lg'}
            >
                <Modal.Header closeButton>
                    <Modal.Title> {address} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GoogleMap
                        center={centerCoords}
                        id={googleMapConfig.id}
                        mapContainerClassName={isMobile ? 'position-absolute' : 'd-block m-auto'}
                        mapContainerStyle={{
                            height: isMobile ? '600px' : '700px',
                            width: '93%'
                        }}
                        zoom={17.8}
                    >
                        {centerCoords &&
                            <Marker
                                title={address}
                                position={centerCoords}
                            />
                        }
                    </GoogleMap>
                </Modal.Body>
            </Modal>
        </>}
    </>)
}



// Geocode.fromLatLng("48.8583701", "2.2922926").then(
//     (response) => {
//       const address = response.results[0].formatted_address;
//     },
//     (error) => {
//       console.error(error);
//     }
//   )
// Get formatted address, city, state, country from latitude & longitude when
// Geocode.setLocationType("ROOFTOP") enabled
// the below parser will work for most of the countries
//   Geocode.fromLatLng("48.8583701", "2.2922926").then(
//     (response) => {
//       const address = response.results[0].formatted_address;
//       let city, state, country;
//       for (let i = 0; i < response.results[0].address_components.length; i++) {
//         for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
//           switch (response.results[0].address_components[i].types[j]) {
//             case "locality":
//               city = response.results[0].address_components[i].long_name;
//               break;
//             case "administrative_area_level_1":
//               state = response.results[0].address_components[i].long_name;
//               break;
//             case "country":
//               country = response.results[0].address_components[i].long_name;
//               break;
//           }
//         }
//       }
//     },
//     (error) => {
//       console.error(error);
//     }
//   )