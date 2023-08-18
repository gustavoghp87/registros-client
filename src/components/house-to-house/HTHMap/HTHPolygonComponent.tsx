import { editInfoWindowsStyles } from '../../../services'
import { generalBlue, generalRed, typeHTHTerritory, typePolygon } from '../../../models'
import { InfoWindow, Polygon } from '@react-google-maps/api'
import { useEffect, useRef, useState } from 'react'

let lastClick: number = 0

export const HTHPolygonComponent = (props: any) => {

    const currentFace: typePolygon = props.currentFace
    const isAddingPolygon: boolean = props.isAddingPolygon
    const isEditingView: boolean = props.isEditingView
    const polygon: typePolygon = props.polygon
    const runIntervals: boolean = props.runIntervals
    const selectBlockAndFaceHandler: Function = props.selectBlockAndFaceHandler
    const setTerritoryHTHHandler: Function = props.setTerritoryHTHHandler
    const territoryHTH: typeHTHTerritory = props.territoryHTH
    const ref = useRef<google.maps.Polygon>()
    const [polygonColor, setPolygonColor] = useState<string>(generalBlue)
    const [showInfoWindow, setShowInfoWindow] = useState<boolean>(false)

    const setIsFinishedHandler = (): void => {
        if ((+new Date() - lastClick) < 500) return
        document.getElementById('setHTHIsFinishedButton')?.click()
        lastClick = +new Date()
    }

    useEffect(() => {
        editInfoWindowsStyles()
        return () => { }
    }, [polygon])

    useEffect(() => {
        setPolygonColor(polygon.completionData?.isFinished ? 'black' : generalBlue)
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
            if (polygon && p1y === polygon.coordsPoint1.lat && p1x === polygon.coordsPoint1.lng
                && p2y === polygon.coordsPoint2.lat && p2x === polygon.coordsPoint2.lng
                && p3y === polygon.coordsPoint3.lat && p3x === polygon.coordsPoint3.lng
            ) return
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
            const currentTerritoryHTH: typeHTHTerritory = territoryHTH
            currentTerritoryHTH.map.polygons = currentTerritoryHTH.map.polygons.map((polygon0: typePolygon) =>
                polygon0.id === polygon.id ? modifiedPolygon : polygon0
            )
            setTerritoryHTHHandler(currentTerritoryHTH, true)
        }, 1000)
        if (!runIntervals) clearInterval(interval0)
        return () => clearInterval(interval0)
    }, [polygon, runIntervals, setTerritoryHTHHandler, territoryHTH])

    return (<>
        <Polygon
            editable={isEditingView || (isAddingPolygon && polygon.id === 0)}
            draggable={isEditingView || (isAddingPolygon && polygon.id === 0)}
            onClick={() => {
                //if (currentFace && currentFace.id === polygon.id) setIsFinishedHandler()
                if (!isEditingView && !isAddingPolygon) selectBlockAndFaceHandler(polygon.block, polygon.face)
            }}
            onLoad={(googlePolygon0: google.maps.Polygon) => ref.current = googlePolygon0}
            onMouseOver={() => {
                if (isEditingView || isAddingPolygon || !ref.current || currentFace) return
                setPolygonColor(generalRed)
                setShowInfoWindow(true)
            }}
            onMouseOut={() => {
                if (isEditingView || isAddingPolygon || !ref.current) return
                setPolygonColor(polygon.completionData?.isFinished ? 'black' : generalBlue)
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
                polygon.coordsPoint3
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
