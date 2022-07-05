import { useMemo, useState, useRef } from 'react'
import { GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { Loading } from '../commons/Loading'
import { typeTerritoryNumber } from '../../models/territory'
import { editHTHMapService } from '../../services/houseToHouseServices'
import { typeCoords, typeHTHMap, typeHTHTerritory, typeMarker, typePolygon } from '../../models/houseToHouse'
import { useAuth } from '../../context/authContext'
import { typeUser } from '../../models/user'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../../store/store'
import HTHMapStyle from './HTHMapStyle.json'
import { isLocalhost } from '../../services/functions'
import { googleMapsAPIDevelopmentKey, googleMapsAPIProductionKey, mapId } from '../../config'

export const HTHMap = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    const territory: typeTerritoryNumber = props.territory
    const territoryHTH: typeHTHTerritory = props.territoryHTH
    const setTerritoryHTH: React.Dispatch<React.SetStateAction<typeHTHTerritory>> = props.setTerritoryHTH
    const setBlockAndFaceHandler: Function = props.setBlockAndFaceHandler
    const dispatch: typeAppDispatch = useDispatch()

    // const centerValue: typeCoords = useMemo(() => (
    //     territoryHTH.hthMap.centerCoords
    // ), [territoryHTH.hthMap.centerCoords])

    const [map, setMap] = useState<google.maps.Map>()
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isAddingPolygon, setIsAddingPolygon] = useState<boolean>(false)
    const [newPolygon, setNewPolygon] = useState<typePolygon>()
    const [newGooglePolygon, setNewGooglePolygon] = useState<google.maps.Polygon>()
    let np = useRef<typePolygon>()

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey,
        id: mapId
    })

    const initMapEditingHandler = (): void => {
        if (isEditing) {
            setIsEditing(false)
            setIsAddingPolygon(false)
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'confirm',
                title: '¿Modificar este mapa?',
                message: `El mapa del territorio ${territory} se va a guardar como se ve ahora`,
                execution: editMapHandler
            }))
        }
        else setIsEditing(true)
    }

    const editMapHandler = async (): Promise<void> => {
        const hthMapEdited: typeHTHMap = territoryHTH.hthMap
        hthMapEdited.polygons = hthMapEdited.polygons.map((polygon: typePolygon) => {
            if (polygon.id === 0) {
                polygon.id = +new Date()
            }
            return polygon
        })
        console.log("Edited to send:", hthMapEdited)
        
        if (!hthMapEdited.centerCoords.lat || !hthMapEdited.centerCoords.lng || !hthMapEdited.markers || !hthMapEdited.polygons || !hthMapEdited.zoom) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: 'Algo falló en el mapa',
                message: `Algo falló en los datosal querer modificar el mapa del territorio ${territory}; refrescar la página e intentar de nuevo`
            }))
            return
        }
        // const success: boolean = await editHTHMapService(territory, hthMapEdited)
        // if (success) reloadHandler()
        // else dispatch(setValuesAndOpenAlertModalReducer({
        //     mode: 'alert',
        //     title: 'Error al editar el mapa',
        //     message: `Algo falló al querer modificar el mapa del territorio ${territory}; refrescar la página e intentar de nuevo`
        // }))
    }

    const addFaceHandler1 = (): void => {
        if (!isAddingPolygon) {
            setIsAddingPolygon(true)
            if (!isEditing) return
            
            const polygon: typePolygon = {
                id: 0,
                block: '1',
                face: 'A',
                coordsPoint1: {
                    lat: territoryHTH.hthMap.centerCoords.lat + 0.001,
                    lng: territoryHTH.hthMap.centerCoords.lng
                },
                coordsPoint2: {
                    lat: territoryHTH.hthMap.centerCoords.lat - 0.0003827,
                    lng: territoryHTH.hthMap.centerCoords.lng + 0.0009239
                },
                coordsPoint3: {
                    lat: territoryHTH.hthMap.centerCoords.lat - 0.0003827,
                    lng: territoryHTH.hthMap.centerCoords.lng - 0.0009239
                },
                isFinished: false
            }
            np.current = polygon
            setNewPolygon(polygon)
            let currentTerritory: typeHTHTerritory = territoryHTH
            currentTerritory.hthMap.polygons.push(polygon)
            //currentTerritory.hthMap.markers = currentTerritory.hthMap.markers.filter(x => x.id > 9)
            setTerritoryHTH(currentTerritory)
        } else {
            setIsAddingPolygon(false)
            
        }
    }

    

    // const addFaceHandler = (event: any): void => {
    //     const lat: number = event.latLng.lat()
    //     const lng: number = event.latLng.lng()
    //     if (!isEditing || !isAddingPolygon || !lat || !lng) return
    //     newPolygonPath = [...(newPolygonPath ?? []), lat, lng]
    //     console.log(newPolygonPath);
        

    //     const newMarker: typeMarker = {
    //         id: newPolygonPath ? newPolygonPath.length : 0,
    //         coords: {
    //             lat: event.latLng.lat(),
    //             lng: event.latLng.lng()
    //         }
    //     }
    //     let currentTerritory: typeHTHTerritory = territoryHTH
    //     currentTerritory.hthMap.markers.push(newMarker)
    //     setTerritoryHTH(currentTerritory)

    //     if (newPolygonPath?.length === 6) {
    //         console.log("6");
            
    //         let newPolygon0: typePolygon = {
    //             id: +new Date(),
    //             block: '1',
    //             face: 'A',
    //             coordsPoint1: {
    //                 lat: newPolygonPath[0],
    //                 lng: newPolygonPath[1]
    //             },
    //             coordsPoint2: {
    //                 lat: newPolygonPath[2],
    //                 lng: newPolygonPath[3]
    //             },
    //             coordsPoint3: {
    //                 lat: newPolygonPath[4],
    //                 lng: newPolygonPath[5]
    //             },
    //             isFinished: false
    //         }

    //         currentTerritory.hthMap.polygons.push(newPolygon0)
    //         //currentTerritory.hthMap.markers = currentTerritory.hthMap.markers.filter(x => x.id > 9)
    //         setTerritoryHTH(currentTerritory)
    //         newPolygonPath = []
    //     }
    // }

    const selectBlockAndFaceHandler = (polygon: typePolygon): void => {
        console.log("Selected", polygon.id, polygon.block, polygon.face)
        setBlockAndFaceHandler(polygon.block, polygon.face)
    }

    const reloadHandler = (): void => window.location.reload()

    const cancelChangesHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Cancelar cambios en el mapa?',
            message: `Los cambios hechos en el mapa ${territory} se eliminarán`,
            execution: reloadHandler
        }))
    }

    const setTerritoryHTHHandler = (territoryHTH0: typeHTHTerritory): void => {
        setTerritoryHTH(territoryHTH0)
    }


    return (<>

        <div className={'position-relative'}
            style={{ marginTop: isMobile ? '160px' : '', marginBottom: isMobile ? '660px' : '' }}
        >
            <GoogleMap
                center={territoryHTH.hthMap.centerCoords}
                id={mapId}
                mapContainerClassName={isMobile ? 'position-absolute' : 'd-block m-auto'}
                mapContainerStyle={{
                    height: '350px',
                    marginRight: '-117px',
                    right: isMobile ? 0 : '',
                    transform: isMobile ? 'rotate(-0.25turn)' : '',
                    width: '600px'
                }}
                // onRightClick={addFaceHandler1}
                onLoad={(mapInstance: google.maps.Map) => setMap(mapInstance)}
                onCenterChanged={() => {
                    const lat: number = map?.getCenter()?.lat() ?? 0
                    const lng: number = map?.getCenter()?.lng() ?? 0
                    if (!lat || !lng) return
                    if (lat === territoryHTH.hthMap.centerCoords.lat && lat === territoryHTH.hthMap.centerCoords.lng) return
                    const newTerritoryHTH: typeHTHTerritory = territoryHTH
                    newTerritoryHTH.hthMap.centerCoords.lat = lat
                    newTerritoryHTH.hthMap.centerCoords.lng = lng
                    setTerritoryHTH(newTerritoryHTH)
                }}
                options={{
                    center: isEditing && !isAddingPolygon ? null : territoryHTH.hthMap.centerCoords,
                    disableDefaultUI: false,
                    draggable: isEditing && !isAddingPolygon,
                    fullscreenControl: false,
                    isFractionalZoomEnabled: true,
                    mapTypeControl: false,
                    mapTypeControlOptions: {
                        mapTypeIds: []
                    },
                    minZoom: 8,
                    noClear: true,
                    // panControl: true,
                    // rotateControl: true,
                    styles: HTHMapStyle,
                    // tilt: 45,
                    // zoom: zoom,
                    zoomControl: isEditing && !isAddingPolygon,
                    zoomControlOptions: {   
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    }
                }}
                zoom={territoryHTH.hthMap.zoom}
                onZoomChanged={() => {
                    if (!map) return
                    const newZoom: number = map.getZoom() || 0
                    if (newZoom && newZoom !== territoryHTH.hthMap.zoom) {
                        let currentTerritoryHTH = territoryHTH
                        currentTerritoryHTH.hthMap.zoom = newZoom
                        setTerritoryHTHHandler(currentTerritoryHTH)
                    }
                }}
            >
                {territoryHTH.hthMap.polygons && !!territoryHTH.hthMap.polygons.length &&
                    territoryHTH.hthMap.polygons.map((polygon: typePolygon) => (
                        <div key={polygon.id}>
                            <Polygon
                                editable={isEditing}
                                
                                draggable={isEditing}
                                path={[
                                    polygon.coordsPoint1,
                                    polygon.coordsPoint2,
                                    polygon.coordsPoint3
                                ]}
                                onDragEnd={() => {
                                    //console.log(np.current)
                                }}
                                onMouseUp={() => {
                                    if (polygon.id !== 0 || !newPolygon || !newGooglePolygon) return
                                    const path: any[] = newGooglePolygon.getPath().getArray()

                                    const newPolygon0: typePolygon = {
                                        block: newPolygon.block,
                                        coordsPoint1: { lat: path[0].lat(), lng: path[0].lng() },
                                        coordsPoint2: { lat: path[1].lat(), lng: path[1].lng() },
                                        coordsPoint3: { lat: path[2].lat(), lng: path[2].lng() },
                                        //face: newPolygon.face,
                                        face: 'F',
                                        id: newPolygon.id,
                                        isFinished: false
                                    }
                                    
                                    setNewPolygon(newPolygon0)

                                    let currentTerritoryHTH: typeHTHTerritory = territoryHTH
                                    currentTerritoryHTH.hthMap.polygons = currentTerritoryHTH.hthMap.polygons.map((polygon: typePolygon) =>
                                        polygon.id === 0 ? newPolygon0 : polygon
                                    )
                                    setTerritoryHTHHandler(currentTerritoryHTH)

                                    const path1: any[] = newGooglePolygon.getPath().getArray()

                                    const newPolygon1: typePolygon = {
                                        block: newPolygon.block,
                                        coordsPoint1: { lat: path1[0].lat(), lng: path1[0].lng() },
                                        coordsPoint2: { lat: path1[1].lat(), lng: path1[1].lng() },
                                        coordsPoint3: { lat: path1[2].lat(), lng: path1[2].lng() },
                                        //face: newPolygon.face,
                                        face: 'F',
                                        id: newPolygon.id,
                                        isFinished: false
                                    }
                                    
                                    setNewPolygon(newPolygon1)

                                    let currentTerritoryHTH1: typeHTHTerritory = territoryHTH
                                    currentTerritoryHTH1.hthMap.polygons = currentTerritoryHTH1.hthMap.polygons.map((polygon: typePolygon) =>
                                        polygon.id === 0 ? newPolygon0 : polygon
                                    )
                                    setTerritoryHTHHandler(currentTerritoryHTH1)
                                }}
                                onClick={() => selectBlockAndFaceHandler(polygon)}
                                onLoad={(googlePolygon0: google.maps.Polygon) => {
                                    if (googlePolygon0) setNewGooglePolygon(googlePolygon0)
                                }}
                                options={{
                                    clickable: true,
                                    fillColor: polygon.isFinished ? 'red' : 'blue',
                                    strokeColor: '',
                                    strokeOpacity: 1,
                                    fillOpacity: 0.2,
                                    strokePosition: google.maps.StrokePosition.INSIDE,
                                    strokeWeight: 1
                                }}
                                // onDragEnd={onEdit}
                                // onLoad={onLoad}
                                // onUnmount={onUnmount}
                            />
                        </div>
                    ))
                }

                {territoryHTH.hthMap.markers && !!territoryHTH.hthMap.markers.length &&
                    territoryHTH.hthMap.markers.map((marker: typeMarker) => (
                        <div key={marker.id}>
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
                        </div>
                    ))
                }
            </GoogleMap>
        </div>

        {user && user.isAdmin && <>
            <button className={`mt-4 d-block m-auto btn ${isEditing ? 'btn-secondary btn-general-secondary' : 'btn-general-blue'}`}
                onClick={() => initMapEditingHandler()}
            >
                {isEditing ? 'Terminar de Editar' : 'Editar Mapa'}
            </button>
            
            {isEditing && <>
                <button className={'mt-4 d-block m-auto btn btn-secondary btn-general-secondary'}
                    onClick={() => cancelChangesHandler()}
                >
                    Cancelar Cambios
                </button>

                {!isAddingPolygon &&
                    <button className={'mt-4 d-block m-auto btn btn-general-blue'}
                        onClick={() => addFaceHandler1()}
                    >
                        Agregar Cara
                    </button>
                }
            </>}
        </>}

        {!isLoaded &&
            <Loading />
        }

        {loadError &&
            <div>
                <h1> Falló mapa: {loadError.message} </h1>
                <h2> {loadError.stack} </h2>
                <h2> {loadError.name} </h2>
            </div>
        }

    </>)
}