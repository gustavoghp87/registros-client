import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { MdDelete, MdEdit } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useAuth } from '../../context/authContext'
import { typeFace, typeObservation } from '../../models/houseToHouse'
import { dark, typeBlock, typeTerritoryNumber } from '../../models/territory'
import { typeUser } from '../../models/user'
import { addHTHObservationService, deleteHTHObservationService, editHTHObservationService } from '../../services/houseToHouseServices'
import { typeRootState } from '../../store/store'
import { generalBlue } from '../_App'

export const ObservacionesHTH = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: typeTerritoryNumber = props.territory
    const street: string = props.street
    const block: typeBlock|'' = props.block
    const face: typeFace|'' = props.face
    const observations: typeObservation[] = props.observations
        .filter((observation: typeObservation) => observation.block === block && observation.face === face).reverse()
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    const [showForm, setShowForm] = useState<boolean>(false)
    const [text, setText] = useState<string>('')

    const submitHandler = (e: Event) => {
        e.preventDefault()
        console.log("Submitting")
        console.log("territory", territory)
        console.log("block", block)
        console.log("face", face)
        console.log("text", text)
        console.log("date", date)
        console.log("id", +new Date())
        if (!text) return
        const observation: typeObservation = {
            block,
            date,
            face,
            id: +new Date(),
            street: '',
            text
        }
        addHTHObservationService(observation, territory).then((success: boolean) => {
            if (success) window.location.reload()
        })
    }

    const editHandler = (observation: typeObservation) => {
        console.log("Editando...", observation)
        // open pop up
        // editHTHObservationService(observation, territory)
    }

    const deleteHandler = (id: number) => {
        console.log("Eliminando...", id)
        deleteHTHObservationService(id, territory)
    }

    const cancelForm = () => {
        console.log("Canceled")
        setShowForm(false)
        setText('')
    }

    return (
        <>
        <br />
        <br />
        <br />

            <h1 className={'text-center text-white d-block mx-auto pt-3 mt-4'}
                style={{ backgroundColor: generalBlue, minHeight: '80px', width: '80%' }}
            >
                {observations && !!observations.length ? 'Observaciones' : 'No hay Observaciones en esta cara'}
            </h1>

            {observations && !!observations.length && observations.map((observation: typeObservation, index: number) => (
                <div key={index}
                    className={`${isMobile ? 'text-center' : 'd-flex'} align-items-center justify-content-center mt-4 ${isDarkMode ? 'text-white' : ''}`}>

                    {isMobile ?
                        <div style={{ border: '1px solid white', borderRadius: '7px' }}>
                            <div>
                                <h2 className={'mr-2'}>
                                    {observation.text}
                                </h2>
                            </div>
                            <small className={'text-muted'}> Fecha: {observation.date} </small>

                            {user && user.isAdmin && <>
                                <div>
                                    <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                        onClick={() => editHandler(observation)}
                                    >
                                        Editar &nbsp;
                                    </h4>

                                    <MdEdit className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                        onClick={() => editHandler(observation)}
                                    />
                                </div>
                                <div>
                                    <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                        onClick={() => deleteHandler(observation.id)}
                                        >
                                        Eliminar &nbsp;
                                    </h4>
                                    
                                    <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                        onClick={() => deleteHandler(observation.id)}
                                        />
                                </div>
                            </>}
                        </div>
                    :
                        <>
                            <h2 className={'d-inline mr-2'}>
                                {observation.text}
                            </h2>
                            <small className={'text-muted'}> Fecha: {observation.date} </small>

                            {user && user.isAdmin && <>
                                <h4 style={{ cursor: 'pointer' }}
                                    onClick={() => editHandler(observation)}
                                >
                                    &nbsp; Editar &nbsp;
                                </h4>
                                
                                <MdEdit className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                                    onClick={() => editHandler(observation)}
                                />
                                
                                <h4 style={{ cursor: 'pointer' }}
                                    onClick={() => deleteHandler(observation.id)}
                                >
                                    &nbsp; | &nbsp; Eliminar &nbsp;
                                </h4>
                                
                                <MdDelete className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                                    onClick={() => deleteHandler(observation.id)}
                                />
                            </>}
                            
                        </>
                    }
                </div>
            ))}


            <button className={'btn btn-general-blue d-block m-auto mt-4'} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar' : 'Agregar Observación'}
            </button>

            {showForm &&
                <Container style={{ maxWidth: '600px' }}>
                    <Form onSubmit={(e: any) => submitHandler(e)} className={isDarkMode ? 'text-white' : ''}>

                        <Form.Group className={'mb-3'} controlId={""}>
                            <Form.Label> Observación </Form.Label>
                            <Form.Control as={'textarea'} rows={3} value={text} onChange={(e: any) => setText(e.target.value)} />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Territorio </Form.Label>
                            <Form.Control
                                value={territory}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Manzana </Form.Label>
                            <Form.Control
                                value={block ? block : 'Todas'}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Cara </Form.Label>
                            <Form.Control
                                value={face ? face : 'Todas'}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Calle </Form.Label>
                            <Form.Control
                                value={street ? street : 'Todas'}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Fecha </Form.Label>
                            <Form.Control
                                value={date}
                                disabled
                            />
                        </Form.Group>

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

            <br />
            <br />
            <br />
            <br />
        </>
    )
}