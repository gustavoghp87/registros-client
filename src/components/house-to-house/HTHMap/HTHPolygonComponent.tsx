import {Polygon } from '@react-google-maps/api'
import { typeHTHTerritory, typePolygon } from '../../../models/houseToHouse'

export const HTHPolygonComponent = (props: any) => {

    const polygon: typePolygon = props.polygon
    const isEditing: boolean = props.isEditing
    const isAddingPolygon: boolean = props.isAddingPolygon
    const selectBlockAndFaceHandler: Function = props.selectBlockAndFaceHandler
    const setTerritoryHTHHandler: Function = props.setTerritoryHTHHandler
    const territoryHTH: typeHTHTerritory = props.territoryHTH

    const onLoadPolygonHandler = (googlePolygon0: google.maps.Polygon): void => {
        console.log(polygon);
        
        setInterval(() => {
            console.log(polygon);
            const path: any[] = googlePolygon0.getPath().getArray()
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
                coordsPoint1: { lat: p1y, lng: p1x },
                coordsPoint2: { lat: p2y, lng: p2x },
                coordsPoint3: { lat: p3y, lng: p3x },
                face: polygon.face,
                id: polygon.id,
                isFinished: polygon.isFinished
            }
            const currentTerritoryHTH: typeHTHTerritory = territoryHTH
            currentTerritoryHTH.hthMap.polygons = currentTerritoryHTH.hthMap.polygons.map((polygon0: typePolygon) =>
                polygon0.id === polygon.id ? modifiedPolygon : polygon0
            )
            setTerritoryHTHHandler(currentTerritoryHTH)
            console.log("Damn");
            
        }, 300)
    }

    return (
        <Polygon
            editable={isEditing || (isAddingPolygon && polygon.id === 0)}
            draggable={isEditing || (isAddingPolygon && polygon.id === 0)}
            path={[
                polygon.coordsPoint1,
                polygon.coordsPoint2,
                polygon.coordsPoint3
            ]}
            onClick={() => selectBlockAndFaceHandler(polygon)}
            onLoad={onLoadPolygonHandler}
            options={{
                clickable: true,
                fillColor: polygon.isFinished ? 'red' : 'blue',
                strokeColor: '',
                strokeOpacity: 1,
                fillOpacity: 0.2,
                strokePosition: google.maps.StrokePosition.INSIDE,
                strokeWeight: 1
            }}
        />
    )
}
