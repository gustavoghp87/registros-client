import { getGeocodingFromAddressService } from '../../services'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { googleMapsAPIKey, mapId } from '../../config'
import { Loading } from '../commons'
import { Modal } from 'react-bootstrap'
import { typeCoords, typeRootState } from '../../models'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const MapModal = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: googleMapsAPIKey,
        id: mapId
    })
    const address: string = props.address
    const hideGoogleMapHandler: Function = props.hideGoogleMapHandler
    const [centerCoords, setCenterCoords] = useState<typeCoords>()
    
    useEffect(() => {
        let target: string = address + " CABA"
        getGeocodingFromAddressService(target).then((coordinates: typeCoords|null) => {
            if (coordinates && coordinates.lat && coordinates.lng) setCenterCoords({ lat: coordinates.lat, lng: coordinates.lng })
        })
        return () => setCenterCoords(undefined)
    }, [address])

    return (<>

        {!isLoaded && <Loading />}

        {loadError && <h3> Falló: {loadError.message} </h3>}

        {centerCoords &&
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
                        id={mapId}
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
        }
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