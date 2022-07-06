import { useState, useRef } from 'react'
import { GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { Loading } from '../commons/Loading'
import { danger, typeBlock, typeTerritoryNumber } from '../../models/territory'
import { editHTHMapService } from '../../services/houseToHouseServices'
import { typeFace, typeHTHMap, typeHTHTerritory, typeMarker, typePolygon } from '../../models/houseToHouse'
import { useAuth } from '../../context/authContext'
import { typeUser } from '../../models/user'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../../store/store'
import HTHMapStyle from './HTHMapStyle.json'
import { isLocalhost } from '../../services/functions'
import { googleMapsAPIDevelopmentKey, googleMapsAPIProductionKey, mapId } from '../../config'
import { Dropdown } from 'react-bootstrap'

export const HTHMap = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const blocks: typeBlock[] = props.blocks
    const territory: typeTerritoryNumber = props.territory
    const territoryHTH: typeHTHTerritory = props.territoryHTH
    const setTerritoryHTH: React.Dispatch<React.SetStateAction<typeHTHTerritory>> = props.setTerritoryHTH
    const setBlockAndFaceHandler: Function = props.setBlockAndFaceHandler
    const dispatch: typeAppDispatch = useDispatch()
    const [map, setMap] = useState<google.maps.Map>()
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isAddingPolygon, setIsAddingPolygon] = useState<boolean>(false)
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: isLocalhost ? googleMapsAPIDevelopmentKey : googleMapsAPIProductionKey,
        id: mapId
    })

    const initMapEditingHandler = (): void => {
        if (isEditing || isAddingPolygon) {
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
        if (hthMapEdited.polygons.length) hthMapEdited.polygons = hthMapEdited.polygons.map((polygon: typePolygon) => {
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
            setIsEditing(false)
            setIsAddingPolygon(false)
            return
        }
        setIsEditing(false)
        setIsAddingPolygon(false)
        const success: boolean = await editHTHMapService(territory, hthMapEdited)
        if (success) reloadHandler()
        else dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: 'Error al editar el mapa',
            message: `Algo falló al querer modificar el mapa del territorio ${territory}; refrescar la página e intentar de nuevo`
        }))
    }

    const addFaceHandler = (selectedBlock: typeBlock|null = null, selectedFace: typeFace|null = null): void => {
        if (!isAddingPolygon) {
            setIsAddingPolygon(true)
            return
        }
        const currentPolygon: typePolygon|undefined = territoryHTH.hthMap.polygons.find(x => x.id === 0)
        if (!selectedBlock || !selectedFace || currentPolygon) return
        console.log(selectedBlock, selectedFace, currentPolygon);
        
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
        let currentTerritory: typeHTHTerritory = territoryHTH
        currentTerritory.hthMap.polygons.push(polygon)
        setTerritoryHTH(currentTerritory)
    }
    
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
                    center: isEditing ? null : territoryHTH.hthMap.centerCoords,
                    disableDefaultUI: false,
                    draggable: isEditing,
                    fullscreenControl: isEditing,
                    fullscreenControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
                    isFractionalZoomEnabled: true,
                    mapTypeControl: false,
                    // mapTypeControlOptions: {
                    //     mapTypeIds: []
                    // },
                    minZoom: 8,
                    noClear: true,
                    panControl: true,
                    rotateControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
                    rotateControl: true,
                    styles: HTHMapStyle,
                    tilt: 45,
                    // zoom: zoom,
                    zoomControl: isEditing,
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
                                editable={isEditing || (isAddingPolygon && polygon.id === 0)}
                                draggable={isEditing || (isAddingPolygon && polygon.id === 0)}
                                path={[
                                    polygon.coordsPoint1,
                                    polygon.coordsPoint2,
                                    polygon.coordsPoint3
                                ]}
                                onClick={() => selectBlockAndFaceHandler(polygon)}
                                onLoad={(googlePolygon0: google.maps.Polygon) => {
                                    
                                    setInterval(() => {
                                        const path: any[] = googlePolygon0.getPath().getArray()
                                        const p1y: number = path[0].lat()
                                        const p1x: number = path[0].lng()
                                        const p2y: number = path[1].lat()
                                        const p2x: number = path[1].lng()
                                        const p3y: number = path[2].lat()
                                        const p3x: number = path[2].lng()
                                        
                                        if (polygon && p1y === polygon.coordsPoint1.lat && p1x === polygon.coordsPoint1.lng
                                            && p2y === polygon.coordsPoint2.lat && p2x === polygon.coordsPoint2.lng
                                            && p3y === polygon.coordsPoint3.lat && p3x === polygon.coordsPoint3.lng) return
                                        console.log("Passed")
                                        const modifiedPolygon: typePolygon = {
                                            block: polygon.block,
                                            coordsPoint1: { lat: p1y, lng: p1x },
                                            coordsPoint2: { lat: p2y, lng: p2x },
                                            coordsPoint3: { lat: p3y, lng: p3x },
                                            face: polygon.face,
                                            id: polygon.id,
                                            isFinished: polygon.isFinished
                                        }
                                        let currentTerritoryHTH: typeHTHTerritory = territoryHTH
                                        currentTerritoryHTH.hthMap.polygons = currentTerritoryHTH.hthMap.polygons.map((polygon0: typePolygon) =>
                                            polygon0.id === polygon.id ? modifiedPolygon : polygon0
                                        )
                                        setTerritoryHTHHandler(currentTerritoryHTH)
                                    }, 300)
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
        
        {isAddingPolygon &&
            <AddFaceOptions
                addFaceHandler={addFaceHandler}
                blocks={blocks}
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

const AddFaceOptions = (props: any) => {
    const blocks: typeBlock[] = props.blocks
    const faces: typeFace[] = ['A', 'B', 'C', 'D', 'E', 'F']
    const addFaceHandler: Function = props.addFaceHandler
    const [selectedBlock, setSelectedBlock] = useState<typeBlock>()
    const [selectedFace, setSelectedFace] = useState<typeFace>()
    const [showFaceMenu, setShowFaceMenu] = useState<boolean>(false)

    const selectBlockHandler = (block: typeBlock): void => {
        setSelectedBlock(block)
        setShowFaceMenu(true)
        addFaceHandler(block, selectedFace)
    }
    const selectFaceHandler = (face: typeFace): void => {
        setSelectedFace(face)
        addFaceHandler(selectedBlock, face)
    }
    
    return (
        <div className={'d-flex justify-content-center mt-4'}>
            <Dropdown className={'d-inline mr-2'}>
                <Dropdown.Toggle variant={danger}>
                    {selectedBlock ? `Manzana ${selectedBlock}` : "Seleccionar la Manzana"} &nbsp;
                </Dropdown.Toggle>
                <Dropdown.Menu show>
                    <Dropdown.Header> Seleccionar la Manzana </Dropdown.Header>
                    {blocks && !!blocks.length && blocks.map((block: typeBlock) => (
                        <Dropdown.Item key={block} eventKey={block} onClick={() => selectBlockHandler(block)}>
                            {`Manzana ${block}`}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown className={'d-inline ml-2'}>
                <Dropdown.Toggle variant={danger}>
                    {selectedFace ? `==> Cara ${selectedFace}` : "Seleccionar la Cara"} &nbsp;
                </Dropdown.Toggle>
                <Dropdown.Menu show={showFaceMenu}>
                    <Dropdown.Header> Seleccionar la Cara </Dropdown.Header>
                    {faces && !!faces.length && faces.map((face: typeFace) => (
                        <Dropdown.Item key={face} eventKey={face} onClick={() => selectFaceHandler(face)}>
                            {`Cara ${face}`}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
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
    //     setTerritoryHTH(currentTerritory)
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
    //         setTerritoryHTH(currentTerritory)
    //         newPolygonPath = []
    //     }
    // }
