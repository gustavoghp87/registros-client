import { useState } from 'react'
import { Card, Row } from 'react-bootstrap'

export const HTHStreetCard = (props: any) => {

    const buildings = props.buildings
    const street: string = props.street
    const streets: string[] = props.streets
    const sendUpdateBySocket: any = props.sendUpdateBySocket
    const buildingNumber: number = buildings.filter((building: any) => building.street === street).length
    const [showBuildings, setShowBuildings] = useState<boolean>(false)


    return (
    <>
        <Card
            className={'d-flex justify-content-center align-items-center bg-dark'}
            style={{
                marginTop: '50px',
                marginBottom: '50px',
                border: '1px solid gray',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                backgroundColor: false ? '#B0B0B0' : '',
                maxWidth: '100%'
            }}
        >
            <Row className={'py-3 mb-1 text-white bg-success w-100 align-center'}
                onClick={() => setShowBuildings(!showBuildings)}
                style={{ cursor: 'pointer' }}
            >
                <p className={'text-center my-2 font-weight-bold blockquote'}>
                    Calle {street} <br/> <small>({buildingNumber} {buildingNumber !== 1 ? "edificios" : "edificio"})</small>
                </p>
            </Row>


            {showBuildings && buildings && !!buildings.length &&
                buildings.map((building: any, index: number) => {
                    if (building.street === street) return (
                        <div key={index} className={''} style={{ maxWidth: '90%' }}>
                            <br />
                            
                        </div>
                    )
                    else {return (<div key={index}></div>)}
                })
            }

            <br />


        </Card>

    </>
    )
}