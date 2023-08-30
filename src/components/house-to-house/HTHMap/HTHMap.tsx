import { addHTHPolygonFaceService, editHTHMapService, getHTHTerritoryService } from '../../../services'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { googleMapsApiKey, mapId } from '../../../app-config'
import { hthMapStyle, HTHMarkerComponent, HTHNewFaceOptions, HTHPolygonComponent } from '../'
import { Loading } from '../../commons'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeBlock, typeFace, typeHTHMap, typeHTHTerritory, typeMarker, typePolygon, typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon|null
    isAddingPolygon: boolean
    isEditingView: boolean
    refreshHTHTerritoryHandler: () => void
    selectBlockAndFaceHandler: (block?: typeBlock, face?: typeFace, hthTerritory0?: typeHTHTerritory|null) => void
    setIsAddingPolygon: Dispatch<SetStateAction<boolean>>
    setIsEditingView: Dispatch<SetStateAction<boolean>>
    setShowNewFaceOptions: Dispatch<SetStateAction<boolean>>
    setTerritoryHTH: Dispatch<SetStateAction<typeHTHTerritory|null>>
    showNewFaceOptions: boolean
    territoryHTH: typeHTHTerritory
}

export const HTHMap: FC<propsType> = ({
    currentFace, isAddingPolygon, isEditingView, refreshHTHTerritoryHandler,
    selectBlockAndFaceHandler, setIsAddingPolygon, setIsEditingView, setShowNewFaceOptions,
    setTerritoryHTH, showNewFaceOptions, territoryHTH
}) => {
    const { isMobile, user} = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey,
        id: mapId,
        libraries: ['maps', 'places'],
        region: 'AR',
        language: 'es'
    })
    const dispatch = useDispatch()
    const [map, setMap] = useState<google.maps.Map>()
    const [runIntervals, setRunIntervals] = useState(false)

    const onCenterChangedHandler = (): void => {
        const lat: number = map?.getCenter()?.lat() ?? 0
        const lng: number = map?.getCenter()?.lng() ?? 0
        if (!lat || !lng) return
        if (lat === territoryHTH.map.centerCoords.lat && lng === territoryHTH.map.centerCoords.lng) return
        const currentTerritoryHTH: typeHTHTerritory = territoryHTH
        currentTerritoryHTH.map.centerCoords.lat = lat
        currentTerritoryHTH.map.centerCoords.lng = lng
        setTerritoryHTH(currentTerritoryHTH)
    }

    const onZoomChangedHandler = (): void => {
        if (!map) return
        const newZoom: number = map.getZoom() || 0
        if (!newZoom || newZoom === territoryHTH.map.zoom) return
        const currentTerritoryHTH = territoryHTH
        currentTerritoryHTH.map.zoom = newZoom
        setTerritoryHTH(currentTerritoryHTH)
    }

    const initMapViewEditingHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Modificar este mapa?',
            message: `El mapa del territorio ${territoryHTH.territoryNumber} se va a guardar como se ve ahora`,
            execution: editMapViewHandler
        }))
    }

    const editMapViewHandler = async (): Promise<void> => {
        const editedHTHMap: typeHTHMap = territoryHTH.map
        const unmodifiedHTHTerritory: typeHTHTerritory|null = await getHTHTerritoryService(territoryHTH.territoryNumber)
        if (!unmodifiedHTHTerritory) return
        const editedHTHPolygons: typePolygon[] = []
        editedHTHMap.polygons.forEach((x, index) => {
            const unP: typePolygon = unmodifiedHTHTerritory.map.polygons[index]
            if (x.coordsPoint1.lat !== unP.coordsPoint1.lat || x.coordsPoint1.lng !== unP.coordsPoint1.lng ||
                x.coordsPoint2.lat !== unP.coordsPoint2.lat || x.coordsPoint2.lng !== unP.coordsPoint2.lng ||
                x.coordsPoint3.lat !== unP.coordsPoint3.lat || x.coordsPoint3.lng !== unP.coordsPoint3.lng
            ) editedHTHPolygons.push(x)
        })
        if (!editedHTHMap.centerCoords.lat || !editedHTHMap.centerCoords.lng || !editedHTHMap.markers || !editedHTHMap.polygons
            || !editedHTHMap.zoom) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: 'Algo falló en el mapa',
                message: `Algo falló en los datos al querer modificar el mapa del territorio ${territoryHTH.territoryNumber}; refrescar la página e intentar de nuevo`
            }))
            setIsEditingView(false)
            return
        }
        editHTHMapService(territoryHTH.territoryNumber, editedHTHMap, editedHTHPolygons).then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: 'Error al editar el mapa',
                message: `Algo falló al querer modificar el mapa del territorio ${territoryHTH.territoryNumber}; refrescar la página e intentar de nuevo`
            }))
            reloadHandler()
        })
    }

    const initFaceAddingHandler = (selectedBlock: typeBlock|null = null, selectedFace: typeFace|null = null, selectedStreet: string|null = null): void => {
        setIsAddingPolygon(true)
        setShowNewFaceOptions(false)
        const currentPolygon: typePolygon|undefined = territoryHTH.map.polygons.find(x => x.id === 0)
        if (!selectedBlock || !selectedFace || !selectedStreet || currentPolygon) return
        const polygon: typePolygon = {
            id: 0,
            block: selectedBlock,
            doNotCalls: [],
            completionData: {
                completionDates: [],
                isFinished: false,
                reopeningDates: []
            },
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
            observations: [],
            street: selectedStreet
        }
        const currentTerritory: typeHTHTerritory = territoryHTH
        currentTerritory.map.polygons = [...currentTerritory.map.polygons, polygon]
        setTerritoryHTH(currentTerritory)
    }

    const addFaceHandler = (): void => {
        const hthMapEdited: typeHTHMap = territoryHTH.map
        if (!hthMapEdited.polygons.length) return
        const newPolygon: typePolygon|undefined = hthMapEdited.polygons.find(x => x.id === 0)
        if (!newPolygon) return
        newPolygon.id = +new Date()
        addHTHPolygonFaceService(territoryHTH.territoryNumber, newPolygon).then((success: boolean) => {
            if (success) reloadHandler()
            else dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Error al editar el mapa",
                message: `Algo falló al querer agregar esta cara al mapa del territorio ${territoryHTH.territoryNumber}; refrescar la página e intentar de nuevo`
            }))
        })
    }

    // const intervalExecution = (googlePolygon0: google.maps.Polygon, polygon: typePolygon) => {
    //     const path: any[] = googlePolygon0.getPath().getArray()
    //     const p1y: number = path[0].lat()
    //     const p1x: number = path[0].lng()
    //     const p2y: number = path[1].lat()
    //     const p2x: number = path[1].lng()
    //     const p3y: number = path[2].lat()
    //     const p3x: number = path[2].lng()
    //     if (polygon
    //         && p1y === polygon.coordsPoint1.lat && p1x === polygon.coordsPoint1.lng
    //         && p2y === polygon.coordsPoint2.lat && p2x === polygon.coordsPoint2.lng
    //         && p3y === polygon.coordsPoint3.lat && p3x === polygon.coordsPoint3.lng
    //     ) return
    //     const modifiedPolygon: typePolygon = {
    //         block: polygon.block,
    //         completionData: polygon.completionData,
    //         coordsPoint1: { lat: p1y, lng: p1x },
    //         coordsPoint2: { lat: p2y, lng: p2x },
    //         coordsPoint3: { lat: p3y, lng: p3x },
    //         doNotCalls: polygon.doNotCalls,
    //         face: polygon.face,
    //         id: polygon.id,
    //         observations: polygon.observations,
    //         street: polygon.street
    //     }
    //     const currentTerritoryHTH: typeHTHTerritory = territoryHTH
    //     currentTerritoryHTH.map.polygons = currentTerritoryHTH.map.polygons.map((polygon0: typePolygon) =>
    //         polygon0.id === polygon.id ? modifiedPolygon : polygon0
    //     )
    //     setTerritoryHTH(currentTerritoryHTH)
    // }
    
    const cancelChangesHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Cancelar cambios en el mapa?',
            message: `Los cambios hechos en el mapa ${territoryHTH.territoryNumber} se eliminarán`,
            execution: reloadHandler
        }))
    }

    const reloadHandler = (): void => {
        refreshHTHTerritoryHandler()
        setIsAddingPolygon(false)
        setIsEditingView(false)
        setRunIntervals(false)
        setShowNewFaceOptions(false)
    }

    if (!isLoaded) return <Loading />

    return (<>
        <div className={'position-relative'} style={{ marginBottom: isMobile ? '660px' : '' }}>
            <GoogleMap
                center={territoryHTH.map.centerCoords}
                id={mapId}
                mapContainerClassName={isMobile ? 'position-absolute' : 'd-block m-auto'}
                mapContainerStyle={{
                    height: isMobile ? '600px' : '700px',
                    width: isMobile ? '100%' : '90%'
                }}
                onLoad={(mapInstance: google.maps.Map) => setMap(mapInstance)}
                onCenterChanged={() => onCenterChangedHandler()}
                options={{
                    center: isEditingView ? null : territoryHTH.map.centerCoords,
                    disableDefaultUI: false,
                    draggable: isMobile || isEditingView,
                    fullscreenControl: isEditingView,
                    fullscreenControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
                    isFractionalZoomEnabled: true,
                    mapTypeControl: false,
                    minZoom: 8,
                    panControl: true,
                    streetViewControl: !isEditingView,
                    styles: hthMapStyle,
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
                                currentFace={currentFace}
                                // intervalExecution={intervalExecution}
                                isAddingPolygon={isAddingPolygon}
                                isEditingView={isEditingView}
                                polygon={polygon}
                                runIntervals={runIntervals}
                                selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                                setTerritoryHTH={setTerritoryHTH}
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
        
        {(isAddingPolygon || showNewFaceOptions) &&
            <HTHNewFaceOptions
                initFaceAddingHandler={initFaceAddingHandler}
                territoryHTH={territoryHTH}
                show={isAddingPolygon && showNewFaceOptions}
            />
        }

        {user.isAdmin && !isMobile &&
            <div className={'d-flex justify-content-center'}>
                {!isAddingPolygon &&
                    <button className={`mt-4 me-4 btn ${isEditingView ? 'btn-danger btn-size12' : 'btn-general-blue'}`}
                        onClick={() => {
                            if (isEditingView) {
                                initMapViewEditingHandler()
                            } else {
                                selectBlockAndFaceHandler()
                                setIsEditingView(true)
                                setRunIntervals(true)
                            }
                        }}
                    >
                        {isEditingView ? 'Guardar Cambios' : 'Editar Mapa'}
                    </button>
                }
                {!isEditingView && !showNewFaceOptions &&
                    <button className={`mt-4 btn ${isAddingPolygon ? 'btn-danger btn-size12' : 'btn-general-blue'}`}
                        onClick={() => {
                            if (isAddingPolygon) {
                                addFaceHandler()
                            } else {
                                selectBlockAndFaceHandler()
                                setIsAddingPolygon(true)
                                setRunIntervals(true)
                                setShowNewFaceOptions(true)
                            }
                        }}
                    >
                        {isAddingPolygon ? 'Guardar Cambios' : 'Agregar Cara'}
                    </button>
                }
                {(isEditingView || isAddingPolygon) && <>
                    <button className={`btn btn-secondary btn-size12 mt-4 ${showNewFaceOptions ? '' : 'ms-4'}`}
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
