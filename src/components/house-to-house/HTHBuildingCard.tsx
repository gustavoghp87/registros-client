import { useState } from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { isMobile } from '../../services/functions'
import { HTHStateDropdown } from './HTHStateDropdown'
import { HTHHouseholdModal } from './HTHHouseholdModal'
import * as types from '../../models/houseToHouse'
import { typeHTHBuilding, typeHTHHousehold } from '../../models/houseToHouse'

export const HTHBuildingCard = (props: any) => {

    const building: typeHTHBuilding = props.building
    const streets: string[] = props.streets
    const sendUpdateBySocket: any = props.sendUpdateBySocket
    const amount: number = building.households.filter((household: typeHTHHousehold) => household.isChecked).length
    const free: number = building.households.filter((household: typeHTHHousehold) =>
        household.isChecked &&
        (household.estado === types.noPredicado || household.estado === types.noContesto))
        .length
    const [showHouseholds, setShowHouseholds] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)

    const closeHTHModalHandler = (): void => setShowModal(false)

    return (
    <>
        <Card
            className={'d-flex justify-content-center align-items-center bg-dark'}
            style={{
                margin: '20px auto',
                border: '1px solid gray',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                backgroundColor: false ? '#B0B0B0' : '',
                maxWidth: '100%',
                width: '800px'
            }}
            >
            <Row className={'py-2 text-white bg-danger w-100 align-center'}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowHouseholds(!showHouseholds)}
            >
                <Col sm={2}></Col>
                <Col sm={8} className={'text-center my-2 font-weight-bold blockquote'}>
                    Edificio {building.street} {building.streetNumber}
                    <br className={`${isMobile ? '' : 'd-none'}`} />
                    &nbsp; ({amount} timbres, {free} libres) &nbsp;
                </Col>
                
                <Col sm={2} className={`${isMobile ? 'd-none' : ''} text-right my-2 font-weight-bold blockquote`} 
                onClick={() => {if (showHouseholds) setShowModal(true)}}>
                    <span className={`mr-4 ${showHouseholds ? '' : 'd-none'}`}>
                        <span style={{ borderLeft: '3px solid white', height: '50px' }}></span>
                        &nbsp;&nbsp;
                        <span style={{ fontSize: '1.1rem' }}> Editar </span>
                    </span>
                </Col>

                <div className={`${isMobile && showHouseholds ? '' : 'd-none'} text-center my-1 font-weight-bold blockquote`}
                onClick={() => {if (showHouseholds) setShowModal(true)}}>
                    <hr className={'mb-2'} />
                    <span className={'mt-0'} style={{ fontSize: '1.1rem' }}> Editar </span>
                </div>
            </Row>

            {showHouseholds && building.households && !!building.households.length &&
                building.households.map((household: typeHTHHousehold, index: number) => {
                    
                if (household.estado === types.noPredicado) household = { ...household, variant: 'success' }
                if (household.estado === types.contesto) household = { ...household, variant: 'primary' }
                if (household.estado === types.noContesto) household = { ...household, variant: 'warning' }
                if (household.estado === types.cartaDejada) household = { ...household, variant: 'info' }
                if (household.estado === types.noTocar) household = { ...household, variant: 'danger' }

                return (
                    <Card key={index}
                        className={`my-4 w-100 bg-dark ${household.isChecked ? '' : 'd-none'}`}
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
                                buildingId={building._id}
                                sendUpdateBySocket={sendUpdateBySocket}
                                vivienda={household}
                            />

                        </div>

                    </Card>
                )
            })}
        </Card>

        <HTHHouseholdModal
            closeHTHModalHandler={closeHTHModalHandler}
            streets={streets}
            showModal={showModal}
            territory={building.territory}
            building={building}    // edit
        />
    </>
    )
}
