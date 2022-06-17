import { useState } from 'react'
import { Button, Container, Form, Row } from 'react-bootstrap'
import { dark, typeBlock, typeTerritoryNumber } from '../../models/territory'
import { MdDelete, MdEdit } from 'react-icons/md'
import { generalBlue } from '../_App'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { typeUser } from '../../models/user'
import { useAuth } from '../../context/authContext'
import { typeDoNotCall, typeFace } from '../../models/houseToHouse'
import { deleteHTHDoNotCallService, editHTHDoNotCallService } from '../../services/houseToHouseServices'

export const NoTocarHTH = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: typeTerritoryNumber = props.territory
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const doNotCalls: typeDoNotCall[] = props.doNotCalls ? props.doNotCalls
        .filter((noTocar: typeDoNotCall) => noTocar.block === block && noTocar.face === face)
        .sort((a: typeDoNotCall, b: typeDoNotCall) => a.street.localeCompare(b.street)) : ['']
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    const [showForm, setShowForm] = useState<boolean>(false)
    const [street, setStreet] = useState<string>('')
    const [streetNumber, setStreetNumber] = useState<number>(0)
    const [doorBell, setDoorBell] = useState<string>('')

    const editHandler = (doNotCall: typeDoNotCall) => {
        console.log("Editando no tocar...", doNotCall)
        editHTHDoNotCallService(doNotCall, territory).then((success: boolean) => console.log(success))
    }

    const deleteHandler = (id: number) => {
        console.log("Eliminando no tocar...", id)
        deleteHTHDoNotCallService(id, territory).then((success: boolean) => console.log(success))
    }

    const submitHandler = (e: Event) => {
        e.preventDefault()
        console.log("Submitting")
        console.log("territory", territory)
        console.log("block", block)
        console.log("face", face)
        console.log("street", street)
        console.log("streetNumber", streetNumber)
        console.log("date", date)
        console.log("id", +new Date())
        if (streetNumber < 1 || street === 'Seleccionar la calle') return
        const doNotCall: typeDoNotCall = {
            block,
            date,
            doorBell,
            face,
            id: +new Date(),
            street,
            streetNumber
        }
        //addHTHDoNotCallService(doNotCall, territory)
    }

    const cancelForm = () => {
        console.log("Canceled")
        setShowForm(false)
    }

    return (
        <>
            <h1 className={'text-center text-white d-block mx-auto pt-3 mt-4'}
                style={{ backgroundColor: generalBlue, minHeight: '80px', width: '80%' }}
            >
                {doNotCalls && !!doNotCalls.length ? 'Listado de No Tocar' : 'No hay No Tocar en esta cara'}
            </h1>
                
            {doNotCalls && !!doNotCalls.length && doNotCalls.map((noTocar: typeDoNotCall, index: number) => (
                <div key={index}
                    className={`${isMobile ? 'text-center' : 'd-flex'} align-items-center justify-content-center mt-4 ${isDarkMode ? 'text-white' : ''}`}>

                    {isMobile ?
                        <div style={{ border: '1px solid white', borderRadius: '7px' }}>
                            <div>
                                <h2 className={'mr-2'}>
                                    {noTocar.street} {noTocar.streetNumber} {noTocar.doorBell}
                                </h2>
                                <small className={'text-muted'}> Fecha: {noTocar.date} </small>
                            </div>

                            {user && user.isAdmin &&
                            <>
                                <div>
                                    <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                        onClick={() => editHandler(noTocar)}
                                    >
                                        Editar &nbsp;
                                    </h4>

                                    <MdEdit className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                        onClick={() => editHandler(noTocar)}
                                    />
                                </div>

                                <div>
                                    <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                        onClick={() => deleteHandler(noTocar.id)}
                                    >
                                        Eliminar &nbsp;
                                    </h4>
                                    
                                    <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                        onClick={() => deleteHandler(noTocar.id)}
                                    />
                                </div>
                            </>
                            }

                        </div>
                    :
                        <>
                            <h2 className={'d-inline mr-2'}>
                                {noTocar.street} {noTocar.streetNumber} {noTocar.doorBell} | <small className={'text-muted'}> Fecha: {noTocar.date} </small> |
                            </h2>

                            {user && user.isAdmin &&
                            <>
                                
                                <h4 style={{ cursor: 'pointer' }}
                                    onClick={() => editHandler(noTocar)}
                                >
                                    &nbsp; Editar &nbsp;
                                </h4>
                                
                                <MdEdit className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                                    onClick={() => editHandler(noTocar)}
                                />
                                
                                <h4 style={{ cursor: 'pointer' }}
                                    onClick={() => deleteHandler(noTocar.id)}
                                >
                                    &nbsp; | &nbsp; Eliminar &nbsp;
                                </h4>
                                
                                <MdDelete className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                                    onClick={() => deleteHandler(noTocar.id)}
                                />
                            </>
                            }
                        </>
                    }
                </div>
            ))}


            <button className={'btn btn-general-blue d-block m-auto mt-4'} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar' : 'Agregar No Tocar'}
            </button>

            {showForm && user && user.isAdmin &&
                <Container className={'mt-4'} style={{ maxWidth: '600px' }}>
                    <Form onSubmit={(e: any) => submitHandler(e)} className={isDarkMode ? 'text-white' : ''}>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Calle </Form.Label>
                            <Form.Select onChange={(e: any) => setStreet(e.target.value)}>
                                <option> Seleccionar la calle </option>
                                <option value={'Directorio'}>Directorio</option>
                                <option value={'Puán'}>Puán</option>
                                <option value={'Bonifacio'}>Bonifacio</option>
                                <option value={'Miró'}>Miró</option>
                            </Form.Select>
                        </Form.Group>

                        <Row className={'d-flex justify-content-center'}>
                            <Form.Group className={'mb-3 w-50'}>
                                <Form.Label> Altura </Form.Label>
                                <Form.Control placeholder={'Altura'}
                                    type={'number'}
                                    min={0}
                                    value={streetNumber ? streetNumber : ''}
                                    onChange={(e: any) => setStreetNumber(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className={'mb-3 w-50'}>
                                <Form.Label> Timbre </Form.Label>
                                <Form.Control
                                    value={doorBell}
                                    onChange={(e: any) => setDoorBell(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                        <Row className={'mt-2'}>
                            <Form.Group className={'mb-3 w-25'}>
                                <Form.Label> Territorio </Form.Label>
                                <Form.Control
                                    value={territory}
                                    disabled
                                />
                            </Form.Group>
                            
                            <Form.Group className={'mb-3 w-25'}>
                                <Form.Label> Manzana </Form.Label>
                                <Form.Control
                                    value={block ? block : 'Todas'}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className={'mb-3 w-25'}>
                                <Form.Label> Cara </Form.Label>
                                <Form.Control
                                    value={face}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className={'mb-3 w-25'}>
                                <Form.Label> Fecha </Form.Label>
                                <Form.Control
                                    value={date}
                                    disabled
                                />
                            </Form.Group>
                        </Row>

                        {isMobile ?
                            <div className={'pt-3'}>
                                <button className={'btn btn-general-blue d-block mx-auto btn-block'} type={'submit'}> ACEPTAR </button>
                                <br />
                                <Button variant={dark} className={'d-block mx-auto'} onClick={cancelForm}> CANCELAR </Button>
                            </div>
                        :
                            <div className={'pt-3'}>
                                <Button variant={dark} className={'float-right w-25'} onClick={cancelForm}> CANCELAR </Button>
                                <button className={'btn btn-general-blue float-right mr-2 w-50'} type={'submit'}> ACEPTAR </button>
                            </div>
                        }

                    </Form>
                </Container>
            }
        </>
    )
}
