import { useState } from 'react'
import { HTHStateDropdown } from './HTHStateDropdown'
import { Card, Row, Button } from 'react-bootstrap'
import * as types from '../../models/houseToHouse'
import { typeHTHBuilding, typeHTHHousehold } from '../../models/houseToHouse'

export const HTHBuildingCard = (props: any) => {

    const building: typeHTHBuilding = props.building
    const index: number = props.index

    const [showHouseholds, setShowHouseholds] = useState<boolean>(false)


    return (
    <>
        <Card key={index}
            className={'d-flex justify-content-center align-items-center bg-dark'}
            style={{
                marginTop: '20px',
                marginBottom: '20px',
                border: '1px solid gray',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                backgroundColor: false ? '#B0B0B0' : '',
                maxWidth: '100%',
                width: '500px'
            }}
            >
            <Row className={'py-2 text-white bg-danger w-100 align-center'}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowHouseholds(!showHouseholds)}
            >
                <p className={'text-center my-2 font-weight-bold blockquote'}>
                    Edificio {building.street} {building.streetNumber} ({building.households.length} timbres, {building.households.filter((household: typeHTHHousehold) => household.estado === types.noPredicado || household.estado === types.noContesto).length} libres)
                </p>
            </Row>

            {showHouseholds && building.households && !!building.households.length &&
                building.households.map((household: typeHTHHousehold, index2: number) => {
                    
                if (household.estado === types.noPredicado) household = { ...household, variant: 'success' }
                if (household.estado === types.contesto) household = { ...household, variant: 'primary' }
                if (household.estado === types.noContesto) household = { ...household, variant: 'warning' }
                if (household.estado === types.cartaDejada) household = { ...household, variant: 'danger' }
                if (household.estado === types.noTocar) household = { ...household, variant: 'dark' }

                return (
                    <Card key={index2}
                        className={'my-4 w-100 bg-dark'}
                        style={{
                            border: '1px solid gray',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                            maxWidth: '90%'
                        }}
                    >

                        <div className={'my-auto pt-4 pb-2'}>

                            <p className={'text-center font-weight-bold text-white'}>
                                <Button className={'btn btn-secondary active mt-3'}>
                                    {household.piso}° {household.depto}
                                &nbsp;
                                <span className={'pb-1'}> - {building.street} {building.streetNumber} </span>
                                </Button>
                            </p>

                            <HTHStateDropdown
                                vivienda={household}
                                buildingId={building._id}
                            />

                        </div>

                    </Card>
                )
            })}
        </Card>
    </>
    )
}
