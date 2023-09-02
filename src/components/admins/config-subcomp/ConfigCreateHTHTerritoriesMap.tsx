import { Dispatch, FC, SetStateAction } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { googleMapConfig, initCoordinates } from '../../../app-config'
import { Hr, Loading } from '../../commons'
import { hthMapStyle } from '../../house-to-house'
import { typeRootState } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    setMap: Dispatch<SetStateAction<google.maps.Map|null>>
}

export const ConfigCreateHTHTerritoriesMap: FC<propsType> = ({ setMap }) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const { isLoaded, loadError } = useJsApiLoader(googleMapConfig)

    if (loadError) console.log(loadError)

    if (!isLoaded) return <Loading />

    return (<>
        <Hr classes={'my-5'} />

        <h5 className={`text-center my-4 ${isDarkMode ? 'text-white' : ''}`}>
            Establecer algún punto central del territorio de la congregación
        </h5>

        <h5 className={`text-center mb-5 ${isDarkMode ? 'text-white' : ''}`}>
            Este punto va a ser el inicial antes de dibujar las caras de las manzanas (el zoom que se use en este paso no importa)
        </h5>

        {loadError &&
            <h2> Error en el mapa: {loadError.message} {loadError.name} </h2>
        }

        <div className={'position-relative'} style={{ marginBottom: isMobile ? '660px' : '' }}>
            <GoogleMap
                center={initCoordinates}
                id={googleMapConfig.id}
                mapContainerClassName={isMobile ? 'position-absolute' : 'd-block m-auto'}
                mapContainerStyle={{
                    height: isMobile ? '600px' : '500px',
                    width: isMobile ? '100%' : '90%'
                }}
                onLoad={mapInstance => setMap(mapInstance)}
                options={{
                    disableDefaultUI: false,
                    draggable: true,
                    fullscreenControl: false,
                    isFractionalZoomEnabled: true,
                    mapTypeControl: false,
                    minZoom: 8,
                    panControl: true,
                    streetViewControl: true,
                    styles: hthMapStyle,
                    zoom: 16,
                    zoomControl: true,
                    zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM }
                }}
            >
            </GoogleMap>
        </div>
    </>)
}
