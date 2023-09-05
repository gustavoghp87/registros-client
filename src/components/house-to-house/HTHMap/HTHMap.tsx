import { addHTHPolygonFaceService, editHTHMapService, getHTHTerritoryService, getPolygonCoordinates } from '../../../services'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { googleMapConfig } from '../../../app-config'
import { hthMapStyle, HTHMarkerComponent, HTHNewBlockOptions, HTHNewFaceOptions, HTHPolygonComponent } from '..'
import { Loading } from '../../commons'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeBlock, typeNewBlockPolygon, typeFace, typeHTHMap, typeHTHTerritory, typeMarker, typePolygon, typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon|null
    isAddingNewBlock: boolean
    isAddingNewFace: boolean
    isCompletingNewBlock: boolean
    isEditingView: boolean
    refreshHTHTerritoryHandler: () => void
    selectBlockAndFaceHandler: (block?: typeBlock, face?: typeFace, hthTerritory0?: typeHTHTerritory|null) => void
    setIsAddingNewBlock: Dispatch<SetStateAction<boolean>>
    setIsAddingNewFace: Dispatch<SetStateAction<boolean>>
    setIsCompletingNewBlock: Dispatch<SetStateAction<boolean>>
    setIsEditingView: Dispatch<SetStateAction<boolean>>
    setShowNewFaceOptions: Dispatch<SetStateAction<boolean>>
    setTerritoryHTH: Dispatch<SetStateAction<typeHTHTerritory|null>>
    showNewFaceOptions: boolean
    territoryHTH: typeHTHTerritory
}

export const HTHMap: FC<propsType> = ({
    currentFace, isAddingNewFace, isCompletingNewBlock, isAddingNewBlock, isEditingView, refreshHTHTerritoryHandler,
    selectBlockAndFaceHandler, setIsAddingNewBlock, setIsAddingNewFace, setIsCompletingNewBlock, setIsEditingView,
    setShowNewFaceOptions, setTerritoryHTH, showNewFaceOptions, territoryHTH
}) => {
    const { isMobile, user} = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const { isLoaded, loadError } = useJsApiLoader(googleMapConfig)
    const [map, setMap] = useState<google.maps.Map|null>(null)
    const [runIntervals, setRunIntervals] = useState(false)
    const dispatch = useDispatch()

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
        if (!editedHTHMap.centerCoords.lat || !editedHTHMap.centerCoords.lng || !editedHTHMap.markers || !editedHTHMap.polygons || !editedHTHMap.zoom) {
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
        setIsAddingNewFace(true)
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

    const initBlockAddingHandler = (block: typeBlock, numberOfFaces = 4): void => {
        setShowNewFaceOptions(false)
        const newBlockPolygon: typeNewBlockPolygon = {
            block,
            coordinates: [
                {
                    lat: territoryHTH.map.centerCoords.lat + 0.001,
                    lng: territoryHTH.map.centerCoords.lng - 0.001
                },
                {
                    lat: territoryHTH.map.centerCoords.lat + 0.001,
                    lng: territoryHTH.map.centerCoords.lng + 0.001
                },
                {
                    lat: territoryHTH.map.centerCoords.lat - 0.001,
                    lng: territoryHTH.map.centerCoords.lng + 0.001
                },
                {
                    lat: territoryHTH.map.centerCoords.lat - 0.001,
                    lng: territoryHTH.map.centerCoords.lng - 0.001
                }
            ],
            polygons: []
        }
        const currentTerritory: typeHTHTerritory = { ...territoryHTH, map: { ...territoryHTH.map, newBlockPolygon } }
        setTerritoryHTH(currentTerritory)
    }

    const acceptBlockHandler = () => {
        const newBlockPolygon = { ...territoryHTH.map.newBlockPolygon }
        if (!newBlockPolygon || !newBlockPolygon.coordinates) return
        const newPolygons: typePolygon[] = []
        const id = Date.now()
        newBlockPolygon.coordinates.forEach((x, i) => {
            if (!newBlockPolygon || !newBlockPolygon.block) return
            const newPolygon: typePolygon = {
                block: newBlockPolygon.block,
                color: i === 0 ? 'yellow' : i === 1 ? 'green' : i === 2 ? 'red' : 'blue',
                completionData: { completionDates: [], isFinished: false, reopeningDates: [] },
                coordsPoint1: getPolygonCoordinates(1, i, newBlockPolygon.coordinates),
                coordsPoint2: getPolygonCoordinates(2, i, newBlockPolygon.coordinates),
                coordsPoint3: getPolygonCoordinates(3, i, newBlockPolygon.coordinates),
                doNotCalls: [],
                face: 'x',
                id: id + i,
                observations: [],
                street: '',
                buildings: []
            }
            newPolygons.push(newPolygon)
        })
        const currentTerritory = { ...territoryHTH, map: { ...territoryHTH.map, polygons: [...territoryHTH.map.polygons, ...newPolygons] } }
        currentTerritory.map.newBlockPolygon = undefined
        setTerritoryHTH(currentTerritory)
        setIsCompletingNewBlock(true)
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
        setIsAddingNewFace(false)
        setIsAddingNewBlock(false)
        setIsEditingView(false)
        setRunIntervals(false)
        setShowNewFaceOptions(false)
        setIsCompletingNewBlock(false)
    }

    if (!isLoaded) return <Loading />

    return (<>
        <div className={'position-relative'} style={{ marginBottom: isMobile ? '660px' : '' }}>
            <GoogleMap
                center={territoryHTH.map.centerCoords}
                id={googleMapConfig.id}
                mapContainerClassName={isMobile ? 'position-absolute' : 'd-block m-auto'}
                mapContainerStyle={{
                    height: isMobile ? '600px' : '700px',
                    width: isMobile ? '100%' : '90%'
                }}
                onLoad={mapInstance => setMap(mapInstance)}
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
                {!!territoryHTH.map.polygons?.length && territoryHTH.map.polygons.map(polygon =>
                    <HTHPolygonComponent key={polygon.id}
                        currentFace={currentFace}
                        isAddingPolygon={isAddingNewFace}
                        isEditingView={isEditingView}
                        polygon={polygon}
                        runIntervals={runIntervals}
                        selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                        setTerritoryHTH={setTerritoryHTH}
                        territoryHTH={territoryHTH}
                    />
                )}
                {/* New block */}
                {territoryHTH.map.newBlockPolygon &&
                    <HTHPolygonComponent
                        currentFace={null}
                        isAddingPolygon={true}
                        isEditingView={false}
                        polygon={{
                            block: territoryHTH.map.newBlockPolygon.block,
                            completionData: {
                                completionDates: [],
                                isFinished: false,
                                reopeningDates: []
                            },
                            coordsPoint1: territoryHTH.map.newBlockPolygon.coordinates[0],
                            coordsPoint2: territoryHTH.map.newBlockPolygon.coordinates[1],
                            coordsPoint3: territoryHTH.map.newBlockPolygon.coordinates[2],
                            coordsPoint4: territoryHTH.map.newBlockPolygon.coordinates[3],
                            doNotCalls: [],
                            face: 'x',
                            id: 0,
                            observations: [],
                            street: ''
                        }}
                        runIntervals={runIntervals}
                        selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                        setTerritoryHTH={setTerritoryHTH}
                        territoryHTH={territoryHTH}
                    />
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
        
        {(isAddingNewFace || showNewFaceOptions) &&
            <HTHNewFaceOptions
                initFaceAddingHandler={initFaceAddingHandler}
                territoryHTH={territoryHTH}
                show={isAddingNewFace && showNewFaceOptions}
            />
        }

        {isAddingNewBlock &&
            <HTHNewBlockOptions
                initBlockAddingHandler={initBlockAddingHandler}
                isCompletingNewBlock={isCompletingNewBlock}
                setRunIntervals={setRunIntervals}
                setTerritoryHTH={setTerritoryHTH}
                territoryHTH={territoryHTH}
            />
        }

        {user.isAdmin && !isMobile &&
            <div className={'d-flex justify-content-center'}>

                {!isAddingNewFace && !isEditingView && !isAddingNewBlock && <>
                    <button className={'btn btn-general-blue mt-4 me-4'}
                        onClick={() => {
                            selectBlockAndFaceHandler()
                            setIsEditingView(true)
                            setRunIntervals(true)
                        }}
                    >
                        Editar Mapa
                    </button>
                    <button className={'btn btn-general-blue mt-4 me-4'}
                        onClick={() => setIsAddingNewBlock(true)}
                    >
                        Agregar Manzana
                    </button>
                    <button className={'btn btn-general-blue mt-4'}
                        onClick={() => {
                            selectBlockAndFaceHandler()
                            setIsAddingNewFace(true)
                            setRunIntervals(true)
                            setShowNewFaceOptions(true)
                        }}
                    >
                        Agregar Cara
                    </button>
                </>}

                {isAddingNewFace && !showNewFaceOptions &&
                    <button className={'btn btn-danger btn-size12 mt-4'} onClick={() => addFaceHandler()}>
                        Guardar Cambios
                    </button>
                }

                {isAddingNewBlock && territoryHTH.map.newBlockPolygon &&
                    <button className={'btn btn-general-blue mt-4'} onClick={() => acceptBlockHandler()}>
                        Aceptar Manzana Nueva
                    </button>
                }

                {isEditingView &&
                    <button className={'btn btn-danger btn-size12 mt-4 me-4'} onClick={() => initMapViewEditingHandler()}>
                        Guardar Cambios
                    </button>
                }

                {(isEditingView || isAddingNewFace || isAddingNewBlock) &&
                    <button className={`btn btn-secondary btn-size12 mt-4 ${showNewFaceOptions ? '' : 'mx-4'}`}
                        onClick={() => cancelChangesHandler()}
                    >
                        Cancelar Cambios
                    </button>
                }
            </div>
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
