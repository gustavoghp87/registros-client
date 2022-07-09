import { useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { useAuth } from '../../../context/authContext'
import { useDispatch, useSelector } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../../store/AlertModalSlice'
import { typeAppDispatch, typeRootState } from '../../../store/store'
import { Loading } from '../../commons/Loading'
import HTHMapStyle from './HTHMapStyle.json'
import { HTHPolygonComponent } from './HTHPolygonComponent'
import { HTHMarkerComponent } from './HTHMarkerComponent'
import { HTHNewFaceOptions } from './HTHNewFaceOptions'
import { editHTHMapService } from '../../../services/houseToHouseServices'
import { isLocalhost } from '../../../services/functions'
import { googleMapsAPIDevelopmentKey, googleMapsAPIProductionKey, mapId } from '../../../config'
import { typeBlock, typeTerritoryNumber } from '../../../models/territory'
import { typeFace, typeHTHMap, typeHTHTerritory, typeMarker, typePolygon } from '../../../models/houseToHouse'
import { typeUser } from '../../../models/user'

export const HTHMap = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey,
        id: mapId
    })
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const dispatch: typeAppDispatch = useDispatch()
    const blocks: typeBlock[] = props.blocks
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const setBlockAndFaceHandler: Function = props.setBlockAndFaceHandler
    const setTerritoryHTHHandler: React.Dispatch<React.SetStateAction<typeHTHTerritory>> = props.setTerritoryHTHHandler
    const territory: typeTerritoryNumber = props.territory
    const territoryHTH: typeHTHTerritory = props.territoryHTH
    const [map, setMap] = useState<google.maps.Map>()
    const [isAddingPolygon, setIsAddingPolygon] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const onCenterChangedHandler = (): void => {
        const lat: number = map?.getCenter()?.lat() ?? 0
        const lng: number = map?.getCenter()?.lng() ?? 0
        if (!lat || !lng) return
        if (lat === territoryHTH.hthMap.centerCoords.lat && lat === territoryHTH.hthMap.centerCoords.lng) return
        const currentTerritoryHTH: typeHTHTerritory = territoryHTH
        currentTerritoryHTH.hthMap.centerCoords.lat = lat
        currentTerritoryHTH.hthMap.centerCoords.lng = lng
        setTerritoryHTHHandler(currentTerritoryHTH)
    }

    const onZoomChangedHandler = (): void => {
        if (!map) return
        const newZoom: number = map.getZoom() || 0
        if (!newZoom || newZoom === territoryHTH.hthMap.zoom) return
        const currentTerritoryHTH = territoryHTH
        currentTerritoryHTH.hthMap.zoom = newZoom
        setTerritoryHTHHandler(currentTerritoryHTH)
    }

    const initMapEditingHandler = (): void => {
        if (!isEditing && !isAddingPolygon) {
            setIsEditing(true)
            return
        }
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Modificar este mapa?',
            message: `El mapa del territorio ${territory} se va a guardar como se ve ahora`,
            execution: editMapHandler
        }))
    }

    const editMapHandler = async (): Promise<void> => {
        const hthMapEdited: typeHTHMap = territoryHTH.hthMap
        if (hthMapEdited.polygons.length) hthMapEdited.polygons = hthMapEdited.polygons.map((polygon: typePolygon) => {
            if (polygon.id === 0) {
                polygon.id = +new Date()
            }
            return polygon
        })
        if (!hthMapEdited.centerCoords.lat || !hthMapEdited.centerCoords.lng || !hthMapEdited.markers || !hthMapEdited.polygons || !hthMapEdited.zoom) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: 'Algo falló en el mapa',
                message: `Algo falló en los datos al querer modificar el mapa del territorio ${territory}; refrescar la página e intentar de nuevo`
            }))
            setIsEditing(false)
            setIsAddingPolygon(false)
            return
        }
        const success: boolean = await editHTHMapService(territory, hthMapEdited)
        if (success) reloadHandler()
        else dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: 'Error al editar el mapa',
            message: `Algo falló al querer modificar el mapa del territorio ${territory}; refrescar la página e intentar de nuevo`
        }))
    }

    console.log(territoryHTH.hthMap.polygons);
    

    const addFaceHandler = (selectedBlock: typeBlock|null = null, selectedFace: typeFace|null = null): void => {
        console.log(isAddingPolygon);
        if (!isAddingPolygon) {
            setIsAddingPolygon(true)
            return
        }
        const currentPolygon: typePolygon|undefined = territoryHTH.hthMap.polygons.find(x => x.id === 0)
        
        if (!selectedBlock || !selectedFace || currentPolygon) return
        const polygon: typePolygon = {
            id: 0,
            block: selectedBlock,
            face: selectedFace,
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
        const currentTerritory: typeHTHTerritory = territoryHTH
        currentTerritory.hthMap.polygons = [...currentTerritory.hthMap.polygons, polygon]
        console.log(currentTerritory.hthMap.polygons);
        
        setTerritoryHTHHandler(currentTerritory)
    }
    
    const selectBlockAndFaceHandler = (polygon: typePolygon): void => {
        console.log("Selected", polygon.id, polygon.block, polygon.face)
        setBlockAndFaceHandler(polygon.block, polygon.face)
    }
    
    const cancelChangesHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Cancelar cambios en el mapa?',
            message: `Los cambios hechos en el mapa ${territory} se eliminarán`,
            execution: reloadHandler
        }))
    }

    const reloadHandler = (): void => {
        setIsEditing(false)
        setIsAddingPolygon(false)
        refreshHTHTerritoryHandler()
    }


    return (<>
        <div className={'position-relative'}
            style={{
                marginTop: isMobile ? '160px' : '',
                marginBottom: isMobile ? '660px' : ''
            }}
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
                onLoad={(mapInstance: google.maps.Map) => setMap(mapInstance)}
                onCenterChanged={() => onCenterChangedHandler()}
                options={{
                    center: isEditing ? null : territoryHTH.hthMap.centerCoords,
                    disableDefaultUI: false,
                    draggable: isEditing,
                    fullscreenControl: isEditing,
                    fullscreenControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
                    isFractionalZoomEnabled: true,
                    mapTypeControl: false,
                    minZoom: 8,
                    noClear: true,
                    panControl: true,
                    rotateControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
                    rotateControl: true,
                    streetViewControl: !isEditing,
                    styles: HTHMapStyle,
                    tilt: 45,
                    zoom: isEditing ? undefined : territoryHTH.hthMap.zoom,
                    zoomControl: isEditing,
                    zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM }
                }}
                zoom={territoryHTH.hthMap.zoom}
                onZoomChanged={() => onZoomChangedHandler()}
            >
                {/* Polygons */}
                {territoryHTH.hthMap.polygons && !!territoryHTH.hthMap.polygons.length &&
                    territoryHTH.hthMap.polygons.map((polygon: typePolygon) => (
                        <div key={polygon.id}>
                            <HTHPolygonComponent
                                polygon={polygon}
                                isEditing={isEditing}
                                isAddingPolygon={isAddingPolygon}
                                selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                                setTerritoryHTHHandler={setTerritoryHTHHandler}
                                territoryHTH={territoryHTH}
                            />
                        </div>
                    ))
                }
                {/* Markers */}
                {territoryHTH.hthMap.markers && !!territoryHTH.hthMap.markers.length &&
                    territoryHTH.hthMap.markers.map((marker: typeMarker) => (
                        <div key={marker.id}>
                            <HTHMarkerComponent
                                marker={marker}
                            />
                        </div>
                    ))
                }
            </GoogleMap>
        </div>
        
        {isAddingPolygon &&
            <HTHNewFaceOptions
                addFaceHandler={addFaceHandler}
                blocks={blocks}
                territory={territory}
            />
        }

        {user && user.isAdmin && <div className={'d-flex justify-content-center'}>
            {!isAddingPolygon &&
                <button className={`mt-4 mr-4 btn ${isEditing ? 'btn-danger btn-general-secondary' : 'btn-general-blue'}`}
                    onClick={() => initMapEditingHandler()}
                >
                    {isEditing ? 'Guardar Cambios' : 'Editar Mapa'}
                </button>
            }
            {!isEditing &&
                <button className={`mt-4 btn ${isAddingPolygon ? 'btn-danger btn-general-secondary' : 'btn-general-blue'}`}
                    onClick={() => isAddingPolygon ? initMapEditingHandler() : addFaceHandler()}
                >
                    {isAddingPolygon ? 'Guardar Cambios' : 'Agregar Cara'}
                </button>
            }
            {(isEditing || isAddingPolygon) && <>
                <button className={'mt-4 ml-4 btn btn-secondary btn-general-secondary'}
                    onClick={() => cancelChangesHandler()}
                >
                    Cancelar Cambios
                </button>
            </>}
        </div>}

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


    // const addFaceHandler = (event: any): void => {
    //     const lat: number = event.latLng.lat()
    //     const lng: number = event.latLng.lng()
    //     if (!isEditing || !isAddingPolygon || !lat || !lng) return
    //     newPolygonPath = [...(newPolygonPath ?? []), lat, lng]
    //     const newMarker: typeMarker = {
    //         id: newPolygonPath ? newPolygonPath.length : 0,
    //         coords: {
    //             lat: event.latLng.lat(),
    //             lng: event.latLng.lng()
    //         }
    //     }
    //     let currentTerritory: typeHTHTerritory = territoryHTH
    //     currentTerritory.hthMap.markers.push(newMarker)
    //     setTerritoryHTHHandler(currentTerritory)
    //     if (newPolygonPath?.length === 6) {
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
    //         setTerritoryHTHHandler(currentTerritory)
    //         newPolygonPath = []
    //     }
    // }
