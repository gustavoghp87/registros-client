import { useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { dark } from '../../models/territory'
import { MdDelete, MdEdit } from 'react-icons/md'
import { generalBlue } from '../_App'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'

export type typeNoTocar = {
    block: string
    date: string
    direccion: string
    face: string
    id: string
}

export const NoTocar = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: string = props.territory
    const block: string = props.block
    const face: string = props.face
    const noTocarArray: typeNoTocar[] = props.noTocarArray
        .filter((noTocar: typeNoTocar) => noTocar.block === block && noTocar.face === face)
        .sort((a: typeNoTocar, b: typeNoTocar) => a.direccion.localeCompare(b.direccion))
    const date = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    const [showForm, setShowForm] = useState<boolean>(false)
    const [street, setStreet] = useState<string>('')
    const [streetNumber, setStreetNumber] = useState<string>('')

    const editNoTocarHandler = (id: string) => {
        console.log("Editando no tocar...", id)
    }

    const deleteNoTocarHandler = (id: string) => {
        console.log("Eliminando no tocar...", id)
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
                {noTocarArray && !!noTocarArray.length ? 'Listado de No Tocar' : 'No hay No Tocar en esta cara'}
            </h1>
                
            {noTocarArray && !!noTocarArray.length && noTocarArray.map((noTocar: typeNoTocar, index: number) => (
                <div key={index}
                    className={`${isMobile ? 'text-center' : 'd-flex'} align-items-center justify-content-center mt-4 ${isDarkMode ? 'text-white' : ''}`}>

                    {isMobile ?
                        <div style={{ border: '1px solid white', borderRadius: '7px' }}>
                            <div>
                                <h2 className={'mr-2'}>
                                    {noTocar.direccion}
                                    <br/>
                                    <small className={'text-muted'}> Fecha {noTocar.date} </small>
                                </h2>
                            </div>

                            <div>
                                <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                    onClick={() => editNoTocarHandler(noTocar.id)}
                                >
                                    Editar &nbsp;
                                </h4>

                                <MdEdit className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                    onClick={() => editNoTocarHandler(noTocar.id)}
                                />
                            </div>

                            <div>
                                <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                    onClick={() => deleteNoTocarHandler(noTocar.id)}
                                >
                                    Eliminar &nbsp;
                                </h4>
                                
                                <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                    onClick={() => deleteNoTocarHandler(noTocar.id)}
                                />
                            </div>
                        </div>
                    :
                        <>
                            <h2 className={'d-inline mr-2'}>
                                {noTocar.direccion} | <small className={'text-muted'}> Fecha {noTocar.date} </small> |
                            </h2>
                            
                            <h4 style={{ cursor: 'pointer' }}
                                onClick={() => editNoTocarHandler(noTocar.id)}
                            >
                                &nbsp; Editar &nbsp;
                            </h4>
                            
                            <MdEdit className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                                onClick={() => editNoTocarHandler(noTocar.id)}
                            />
                            
                            <h4 style={{ cursor: 'pointer' }}
                                onClick={() => deleteNoTocarHandler(noTocar.id)}
                            >
                                &nbsp; | &nbsp; Eliminar &nbsp;
                            </h4>
                            
                            <MdDelete className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                                onClick={() => deleteNoTocarHandler(noTocar.id)}
                            />
                        </>
                    }
                </div>
            ))}


            <button className={'btn btn-general-blue d-block m-auto mt-4'} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar' : 'Agregar No Tocar'}
            </button>

            {showForm &&
                <Container style={{ maxWidth: '600px' }}>
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

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Altura y timbre </Form.Label>
                            <Form.Control placeholder={'Altura y timbre'}
                                value={streetNumber}
                                onChange={(e: any) => setStreetNumber(e.target.value)}
                            />
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
        </>
    )
}
