import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { editInfoWindowsStyles } from '../../../services'
import { generalBlue, generalRed } from '../../../constants'
import { InfoWindow, Polygon } from '@react-google-maps/api'
import { typeBlock, typeFace, typeHTHTerritory, typePolygon } from '../../../models'

let lastClick: number = 0

type propsType = {
    currentFace: typePolygon|null
    // intervalExecution: (googlePolygon0: google.maps.Polygon, polygon: typePolygon) => void
    isAddingPolygon: boolean
    isEditingView: boolean
    polygon: typePolygon
    runIntervals: boolean
    selectBlockAndFaceHandler: (block?: typeBlock, face?: typeFace, hthTerritory0?: typeHTHTerritory|null) => void
    setTerritoryHTH: Dispatch<SetStateAction<typeHTHTerritory|null>>
    territoryHTH: typeHTHTerritory
}

export const HTHPolygonComponent: FC<propsType> = ({
    currentFace, isAddingPolygon, isEditingView, polygon, runIntervals,
    selectBlockAndFaceHandler, setTerritoryHTH, territoryHTH
}) => {
    const ref = useRef<google.maps.Polygon>()
    const [polygonColor, setPolygonColor] = useState(polygon.color ?? generalBlue)
    const [showInfoWindow, setShowInfoWindow] = useState(false)

    const setIsFinishedHandler = (): void => {
        if ((+new Date() - lastClick) < 500) return
        document.getElementById('setHTHIsFinishedButton')?.click()
        lastClick = +new Date()
    }

    useEffect(() => {
        editInfoWindowsStyles()
    }, [polygon])

    useEffect(() => {
        setPolygonColor(polygon.completionData?.isFinished ? 'black' : polygon.color ?? generalBlue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFace, polygon.completionData, polygon.id])

    useEffect(() => {
        const interval0 = setInterval(() => {
            if (!ref.current) return
            const path: any[] = ref.current.getPath().getArray()
            const p1y: number = path[0].lat()
            const p1x: number = path[0].lng()
            const p2y: number = path[1].lat()
            const p2x: number = path[1].lng()
            const p3y: number = path[2].lat()
            const p3x: number = path[2].lng()
            const p4y: number = path[3]?.lat() || 0
            const p4x: number = path[3]?.lng() || 0
            if (p4y && p4x) {
                if (polygon && p1y === polygon.coordsPoint1.lat && p1x === polygon.coordsPoint1.lng
                    && p2y === polygon.coordsPoint2.lat && p2x === polygon.coordsPoint2.lng
                    && p3y === polygon.coordsPoint3.lat && p3x === polygon.coordsPoint3.lng
                    && p4y === polygon.coordsPoint4?.lat && p4x === polygon.coordsPoint4?.lng
                ) return
            } else {
                if (polygon && p1y === polygon.coordsPoint1.lat && p1x === polygon.coordsPoint1.lng
                    && p2y === polygon.coordsPoint2.lat && p2x === polygon.coordsPoint2.lng
                    && p3y === polygon.coordsPoint3.lat && p3x === polygon.coordsPoint3.lng
                ) return
            }
            const modifiedPolygon: typePolygon = {
                block: polygon.block,
                completionData: polygon.completionData,
                coordsPoint1: { lat: p1y, lng: p1x },
                coordsPoint2: { lat: p2y, lng: p2x },
                coordsPoint3: { lat: p3y, lng: p3x },
                doNotCalls: polygon.doNotCalls,
                face: polygon.face,
                id: polygon.id,
                observations: polygon.observations,
                street: polygon.street
            }
            const currentTerritoryHTH: typeHTHTerritory = { ...territoryHTH }
            if (currentTerritoryHTH.map.newBlockPolygon && p4x && p4y) {
                modifiedPolygon.coordsPoint4 = { lat: p4y, lng: p4x }
                currentTerritoryHTH.map.newBlockPolygon.coordinates = [
                    { lat: p1y, lng: p1x },
                    { lat: p2y, lng: p2x },
                    { lat: p3y, lng: p3x },
                    { lat: p4y, lng: p4x }
                ]
            } else {
                currentTerritoryHTH.map.polygons = currentTerritoryHTH.map.polygons.map(polygon0 =>
                    polygon0.id === polygon.id ? modifiedPolygon : polygon0
                )
            }
            setTerritoryHTH(currentTerritoryHTH)
        }, 500)
        if (!runIntervals) clearInterval(interval0)
        return () => clearInterval(interval0)
    }, [polygon, runIntervals, setTerritoryHTH, territoryHTH])

    return (<>
        <Polygon
            editable={isEditingView || (isAddingPolygon && polygon.id === 0)}
            draggable={isEditingView || (isAddingPolygon && polygon.id === 0)}
            onClick={() => {
                //if (currentFace && currentFace.id === polygon.id) setIsFinishedHandler()
                if (!isEditingView && !isAddingPolygon) {
                    selectBlockAndFaceHandler(polygon.block, polygon.face)
                }
            }}
            onLoad={googlePolygon => ref.current = googlePolygon}
            onMouseOver={() => {
                if (isEditingView || isAddingPolygon || !ref.current || currentFace) return
                setPolygonColor(polygon.color ?? generalRed)
                setShowInfoWindow(true)
            }}
            onMouseOut={() => {
                if (isEditingView || isAddingPolygon || !ref.current) return
                setPolygonColor(polygon.completionData?.isFinished ? 'black' : polygon.color ?? generalBlue)
                setShowInfoWindow(false)
            }}
            options={{
                clickable: true,
                fillColor: polygonColor,
                fillOpacity: currentFace && currentFace.id === polygon.id ? 1 : 0.92,
                strokeColor: '',
                strokeOpacity: 0.9,
                strokePosition: google.maps.StrokePosition.CENTER,
                strokeWeight: 10
            }}
            path={[
                polygon.coordsPoint1,
                polygon.coordsPoint2,
                polygon.coordsPoint3,
                ...(polygon.coordsPoint4 ? [polygon.coordsPoint4] : [])
            ]}
        />

        {polygon.id !== 0 &&
            <div onClick={() => {
                if (currentFace && currentFace.id === polygon.id) setIsFinishedHandler()
                else if (!isEditingView && !isAddingPolygon) selectBlockAndFaceHandler(polygon.block, polygon.face)
            }}>
                <InfoWindow
                    position={{
                        lat: (polygon.coordsPoint1.lat + polygon.coordsPoint2.lat + polygon.coordsPoint3.lat) / 3 + 0.00005,
                        lng: (polygon.coordsPoint1.lng + polygon.coordsPoint2.lng + polygon.coordsPoint3.lng) / 3 - 0.0001
                    }}
                >
                    <div className={showInfoWindow || (currentFace && currentFace.id === polygon.id) ? '' : 'd-none'}
                        style={{
                            border: '3px solid #ffffff',
                            borderRadius: '5px',
                            color: '#ffffff',
                            font: '15px Sans-serif',
                            fontWeight: 'bold',
                            height: '36px',
                            padding: '6px',
                            textAlign: 'center',
                            width: '56px'
                        }}
                    >
                        {polygon.block}-{polygon.face}
                    </div>
                </InfoWindow>
            </div>
        }
    </>)
}
