import { Marker } from '@react-google-maps/api'
import { typeMarker } from '../../../models/houseToHouse'

export const HTHMarkerComponent = (props: any) => {

    const marker: typeMarker = props.marker

    return (
        <Marker
            //animation={google.maps.Animation.DROP}
            clickable={true}
            draggable={true}
            // icon={{
            //     url: "/img/svg/carrito-color.svg",
            //     size: new google.maps.Size(88, 81)
            // }}
            onClick={() => console.log("Clicked", marker.id)}
            onRightClick={() => console.log("Right click", marker.id)}
            options={{
                // label: 'label 123'
                position: {
                    lat: marker.coords.lat,
                    lng: marker.coords.lng
                }
            }}
            position={{
                lat: marker.coords.lat,
                lng: marker.coords.lng
            }}
            // shape={{ coords: [0, 1], type: 'poly' }}   //rect
            title={"Title 123"}
            visible={true}
        />
    )
}
