import { useEffect } from 'react'
import { InfoWindow, Polygon } from '@react-google-maps/api'
import { typeHTHTerritory, typePolygon } from '../../../models/houseToHouse'

export const HTHPolygonComponent = (props: any) => {

    const isAddingPolygon: boolean = props.isAddingPolygon
    const isEditingView: boolean = props.isEditingView
    const polygon: typePolygon = props.polygon
    const selectBlockAndFaceHandler: Function = props.selectBlockAndFaceHandler
    const setTerritoryHTHHandler: Function = props.setTerritoryHTHHandler
    const territoryHTH: typeHTHTerritory = props.territoryHTH

    const onLoadPolygonHandler = (googlePolygon0: google.maps.Polygon): void => {
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
                && p3y === polygon.coordsPoint3.lat && p3x === polygon.coordsPoint3.lng
                ) return
            //console.log(polygon);
            const modifiedPolygon: typePolygon = {
                block: polygon.block,
                coordsPoint1: { lat: p1y, lng: p1x },
                coordsPoint2: { lat: p2y, lng: p2x },
                coordsPoint3: { lat: p3y, lng: p3x },
                doNotCalls: polygon.doNotCalls,
                face: polygon.face,
                id: polygon.id,
                isFinished: polygon.isFinished,
                observations: polygon.observations,
                street: polygon.street                                ////////////////////////////////////////////////////////////////////////
            }
            const currentTerritoryHTH: typeHTHTerritory = territoryHTH
            currentTerritoryHTH.map.polygons = currentTerritoryHTH.map.polygons.map((polygon0: typePolygon) =>
                polygon0.id === polygon.id ? modifiedPolygon : polygon0
            )
            setTerritoryHTHHandler(currentTerritoryHTH)
        }, 1000)
    }

    useEffect(() => {
        setTimeout(() => {
            const elements = document.getElementsByClassName('gm-ui-hover-effect') as HTMLCollectionOf<HTMLElement>
            const x = document.getElementsByClassName('gm-style-iw gm-style-iw-c') as HTMLCollectionOf<HTMLElement>
            const y = document.getElementsByClassName('gm-style-iw-d') as HTMLCollectionOf<HTMLElement>
            const z = document.getElementsByClassName('gm-style-iw-t') as HTMLCollectionOf<HTMLElement>
            for (let i = 0; i < elements.length; i++) {
                try {
                    elements[i].classList.add('d-none')
                    y[i].style.backgroundColor = 'transparent'
                    y[i].style.overflow = 'hidden'
                    const a = y[i] as HTMLElement
                    let b
                    let c
                    if (a) b = a.firstChild as HTMLElement
                    if (b) c = b.firstChild as HTMLElement
                    if (c) c.style.background = 'none'
                    if (x[i] && x[i].classList.contains('gm-style-iw-c')) {
                        x[i].classList.add('pr-2')
                        x[i].classList.add('pb-2')
                        x[i].style.backgroundColor = 'transparent'
                        x[i].classList.remove('gm-style-iw-c')
                    }
                    if (z[i] && z[i].classList.contains('gm-style-iw-t')) {
                        z[i].classList.remove('gm-style-iw-t')
                    }
                } catch (error) {
                    console.log(i, error)
                }
            }
        }, 500)
        return () => { }
    }, [polygon])

    return (<>
        <Polygon
            editable={isEditingView || (isAddingPolygon && polygon.id === 0)}
            draggable={isEditingView || (isAddingPolygon && polygon.id === 0)}
            path={[
                polygon.coordsPoint1,
                polygon.coordsPoint2,
                polygon.coordsPoint3
            ]}
            onClick={() => !isEditingView ? selectBlockAndFaceHandler(polygon.block, polygon.face) : null}
            onLoad={onLoadPolygonHandler}
            options={{
                clickable: true,
                fillColor: polygon.isFinished ? 'red' : 'blue',
                fillOpacity: 0.25,
                strokeColor: '',
                strokeOpacity: 1,
                strokePosition: google.maps.StrokePosition.INSIDE,
                strokeWeight: 2
            }}
        />

        {polygon.id !== 0 &&
            <InfoWindow
                // onLoad={(infoWindow: google.maps.InfoWindow) => {
                //     console.log(infoWindow.getPosition())
                // }}
                position={{
                    lat: (polygon.coordsPoint1.lat + polygon.coordsPoint2.lat + polygon.coordsPoint3.lat) / 3,
                    lng: (polygon.coordsPoint1.lng + polygon.coordsPoint2.lng + polygon.coordsPoint3.lng) / 3
                }}
            >
                <div className={''} style={{
                    background: '#fff',
                    border: '2px solid #000000',
                    borderRadius: '50%',
                    color: '#000000',
                    font: '20px',
                    fontWeight: 'bold',
                    height: '33px',
                    padding: '3px',
                    textAlign: 'center',
                    width: '33px'
                }}>
                    {polygon.block}{polygon.face}
                </div>
            </InfoWindow>
        }
    </>)
}
