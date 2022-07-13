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
import { isLocalhost } from '../../../services/functions'
import { googleMapsAPIDevelopmentKey, googleMapsAPIProductionKey, mapId } from '../../../config'
import { typeBlock } from '../../../models/territory'
import { typeFace, typeHTHMap, typeHTHTerritory, typeMarker, typePolygon } from '../../../models/houseToHouse'
import { typeUser } from '../../../models/user'
import { addHTHPolygonFaceService, editHTHMapService, getHTHTerritoryService } from '../../../services/houseToHouseServices'

export const HTHMap = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey,
        id: mapId
    })
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const dispatch: typeAppDispatch = useDispatch()
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const selectBlockAndFaceHandler: Function = props.selectBlockAndFaceHandler
    const setTerritoryHTHHandler: React.Dispatch<React.SetStateAction<typeHTHTerritory>> = props.setTerritoryHTHHandler
    const territoryHTH: typeHTHTerritory = props.territoryHTH
    const [map, setMap] = useState<google.maps.Map>()
    const [isAddingPolygon, setIsAddingPolygon] = useState<boolean>(false)
    const [isEditingView, setIsEditingView] = useState<boolean>(false)

    const onCenterChangedHandler = (): void => {
        const lat: number = map?.getCenter()?.lat() ?? 0
        const lng: number = map?.getCenter()?.lng() ?? 0
        if (!lat || !lng) return
        if (lat === territoryHTH.map.centerCoords.lat && lat === territoryHTH.map.centerCoords.lng) return
        const currentTerritoryHTH: typeHTHTerritory = territoryHTH
        currentTerritoryHTH.map.centerCoords.lat = lat
        currentTerritoryHTH.map.centerCoords.lng = lng
        setTerritoryHTHHandler(currentTerritoryHTH)
    }

    const onZoomChangedHandler = (): void => {
        if (!map) return
        const newZoom: number = map.getZoom() || 0
        if (!newZoom || newZoom === territoryHTH.map.zoom) return
        const currentTerritoryHTH = territoryHTH
        currentTerritoryHTH.map.zoom = newZoom
        setTerritoryHTHHandler(currentTerritoryHTH)
    }

    const initMapViewEditingHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Modificar este mapa?',
            message: `El mapa del territorio ${territoryHTH.territory} se va a guardar como se ve ahora`,
            execution: editMapViewHandler
        }))
    }

    const editMapViewHandler = async (): Promise<void> => {
        const editedHTHMap: typeHTHMap = territoryHTH.map
        const unmodifiedHTHTerritory: typeHTHTerritory|null = await getHTHTerritoryService(territoryHTH.territory)
        if (!unmodifiedHTHTerritory) return
        const editedHTHPolygons: typePolygon[] = []
        editedHTHMap.polygons.forEach((x, index) => {
            const unP: typePolygon = unmodifiedHTHTerritory.map.polygons[index]
            if (x.coordsPoint1.lat !== unP.coordsPoint1.lat || x.coordsPoint1.lng !== unP.coordsPoint1.lng ||
                x.coordsPoint2.lat !== unP.coordsPoint2.lat || x.coordsPoint2.lng !== unP.coordsPoint2.lng ||
                x.coordsPoint3.lat !== unP.coordsPoint3.lat || x.coordsPoint3.lng !== unP.coordsPoint3.lng
            ) editedHTHPolygons.push(x)
        })
        console.log("Sending polygons:", editedHTHPolygons);
        
        if (!editedHTHMap.centerCoords.lat || !editedHTHMap.centerCoords.lng || !editedHTHMap.markers || !editedHTHMap.polygons
            || !editedHTHMap.zoom) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: 'Algo falló en el mapa',
                message: `Algo falló en los datos al querer modificar el mapa del territorio ${territoryHTH.territory}; refrescar la página e intentar de nuevo`
            }))
            setIsEditingView(false)
            return
        }
        editHTHMapService(territoryHTH.territory, editedHTHMap, editedHTHPolygons).then((success: boolean) => {
            if (success) reloadHandler()
            else dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: 'Error al editar el mapa',
                message: `Algo falló al querer modificar el mapa del territorio ${territoryHTH.territory}; refrescar la página e intentar de nuevo`
            }))
        })
    }

    const initFaceAddingHandler = (selectedBlock: typeBlock|null = null, selectedFace: typeFace|null = null, selectedStreet: string|null = null): void => {
        setIsAddingPolygon(true)
        const currentPolygon: typePolygon|undefined = territoryHTH.map.polygons.find(x => x.id === 0)
        if (!selectedBlock || !selectedFace || !selectedStreet || currentPolygon) return
        const polygon: typePolygon = {
            id: 0,
            block: selectedBlock,
            doNotCalls: [],
            coordsPoint1: {
                lat: territoryHTH.map.centerCoords.lat + 0.001,
                lng: territoryHTH.map.centerCoords.lng
            },
            coordsPoint2: {
                lat: territoryHTH.map.centerCoords.lat - 0.0003827,
                lng: territoryHTH.map.centerCoords.lng + 0.0009239
            },
            coordsPoint3: {
                lat: territoryHTH.map.centerCoords.lat - 0.0003827,
                lng: territoryHTH.map.centerCoords.lng - 0.0009239
            },
            face: selectedFace,
            isFinished: false,
            observations: [],
            street: selectedStreet
        }
        const currentTerritory: typeHTHTerritory = territoryHTH
        currentTerritory.map.polygons = [...currentTerritory.map.polygons, polygon]
        setTerritoryHTHHandler(currentTerritory)
    }

    const addFaceHandler = (): void => {
        const hthMapEdited: typeHTHMap = territoryHTH.map
        if (!hthMapEdited.polygons.length) return
        const newPolygon: typePolygon|undefined = hthMapEdited.polygons.find(x => x.id === 0)
        if (!newPolygon) return
        newPolygon.id = +new Date()
        addHTHPolygonFaceService(newPolygon, territoryHTH.territory).then((success: boolean) => {
            if (success) reloadHandler()
            else dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: 'Error al editar el mapa',
                message: `Algo falló al querer agregar esta cara al mapa del territorio ${territoryHTH.territory}; refrescar la página e intentar de nuevo`
            }))
        })
    }
    
    const cancelChangesHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Cancelar cambios en el mapa?',
            message: `Los cambios hechos en el mapa ${territoryHTH.territory} se eliminarán`,
            execution: reloadHandler
        }))
    }

    const reloadHandler = (): void => {
        setIsEditingView(false)
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
                center={territoryHTH.map.centerCoords}
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
                    center: isEditingView ? null : territoryHTH.map.centerCoords,
                    disableDefaultUI: false,
                    draggable: isEditingView,
                    fullscreenControl: isEditingView,
                    fullscreenControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
                    isFractionalZoomEnabled: true,
                    mapTypeControl: false,
                    minZoom: 8,
                    noClear: true,
                    panControl: true,
                    rotateControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
                    rotateControl: true,
                    streetViewControl: !isEditingView,
                    styles: HTHMapStyle,
                    tilt: 45,
                    zoom: isEditingView ? undefined : territoryHTH.map.zoom,
                    zoomControl: isEditingView,
                    zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM }
                }}
                zoom={territoryHTH.map.zoom}
                onZoomChanged={() => onZoomChangedHandler()}
            >
                {/* Polygons */}
                {territoryHTH.map.polygons && !!territoryHTH.map.polygons.length &&
                    territoryHTH.map.polygons.map((polygon: typePolygon) => (
                        <div key={polygon.id}>
                            <HTHPolygonComponent
                                isAddingPolygon={isAddingPolygon}
                                isEditingView={isEditingView}
                                polygon={polygon}
                                selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                                setTerritoryHTHHandler={setTerritoryHTHHandler}
                                territoryHTH={territoryHTH}
                            />
                        </div>
                    ))
                }
                {/* Markers */}
                {territoryHTH.map.markers && !!territoryHTH.map.markers.length &&
                    territoryHTH.map.markers.map((marker: typeMarker) => (
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
                addFaceHandler={initFaceAddingHandler}
                territoryHTH={territoryHTH}
            />
        }

        {user && user.isAdmin &&
            <div className={'d-flex justify-content-center'} style={{ marginTop: isAddingPolygon ? '100px' : '' }}>
                {!isAddingPolygon &&
                    <button className={`mt-4 mr-4 btn ${isEditingView ? 'btn-danger btn-general-secondary' : 'btn-general-blue'}`}
                        onClick={() => isEditingView ? initMapViewEditingHandler() : setIsEditingView(true)}
                    >
                        {isEditingView ? 'Guardar Cambios' : 'Editar Mapa'}
                    </button>
                }
                {!isEditingView &&
                    <button className={`mt-4 btn ${isAddingPolygon ? 'btn-danger btn-general-secondary' : 'btn-general-blue'}`}
                        onClick={() => isAddingPolygon ? addFaceHandler() : setIsAddingPolygon(true)}
                    >
                        {isAddingPolygon ? 'Guardar Cambios' : 'Agregar Cara'}
                    </button>
                }
                {(isEditingView || isAddingPolygon) && <>
                    <button className={'mt-4 ml-4 btn btn-secondary btn-general-secondary'}
                        onClick={() => cancelChangesHandler()}
                    >
                        Cancelar Cambios
                    </button>
                </>}
            </div>
        }

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
    //     currentTerritory.map.markers.push(newMarker)
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
    //         currentTerritory.map.polygons.push(newPolygon0)
    //         //currentTerritory.map.markers = currentTerritory.map.markers.filter(x => x.id > 9)
    //         setTerritoryHTHHandler(currentTerritory)
    //         newPolygonPath = []
    //     }
    // }
