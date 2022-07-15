import Geocode from 'react-geocode'
import { useEffect, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { Loading } from '../commons/Loading'
import { typeRootState } from '../../store/store'
import { googleMapsAPIDevelopmentKey, googleMapsAPIProductionKey, mapId } from '../../config'
import { isLocalhost } from '../../services/functions'
import { typeCoords } from '../../models/houseToHouse'

export const MapModal = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey,
        id: mapId
    })
    const address: string = props.address
    const hideGoogleMapHandler: Function = props.hideGoogleMapHandler
    const [centerCoords, setCenterCoords] = useState<typeCoords>()
    
    useEffect(() => {
        let target: string = address
        try {
            if (!isNaN(parseInt(address.split(' ')[1])))
                target = address.split(' ')[0] + " " + address.split(' ')[1] + " CABA"
            else if (!isNaN(parseInt(address.split(' ')[2])))
                target = address.split(' ')[0] + " " + address.split(' ')[1] + " " + address.split(' ')[2] + " CABA"
            else if (!isNaN(parseInt(address.split(' ')[3])))
                target = target.split(' ')[0] + " " + address.split(' ')[1] + " " + address.split(' ')[2] + " " + address.split(' ')[3] + " CABA"
            else if (!isNaN(parseInt(address.split(' ')[4])))
                target = target.split(' ')[0] + " " + address.split(' ')[1] + " " + address.split(' ')[2] + " " + address.split(' ')[3] + " " + address.split(' ')[4] + " CABA"
        } catch (error) {
            console.log(error)
        }
        Geocode.setApiKey(isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey)
        Geocode.setLanguage('es')
        Geocode.setRegion('arg')
        Geocode.setLocationType('ROOFTOP')    // ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE
        if (isLocalhost) Geocode.enableDebug()
        Geocode.fromAddress(target).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                setCenterCoords({ lat, lng })
            },
            (error) => { console.error(error) }
        )
        return () => { }
    }, [address])

    return (<>

        {!isLoaded && <Loading />}

        {loadError && <h3> Falló: {loadError.message} </h3>}

        {centerCoords &&
            <Modal
                fullscreen={'md-down'}
                onHide={() => hideGoogleMapHandler()}
                show={centerCoords ? true : false}
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
//       console.log(address);
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
//       console.log(city, state, country);
//       console.log(address);
//     },
//     (error) => {
//       console.error(error);
//     }
//   )