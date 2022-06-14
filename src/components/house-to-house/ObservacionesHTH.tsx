import { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { generalBlue } from '../_App'



export const ObservacionesHTH = (props: any) => {

    const territory: string = props.territory
    const block: string = props.block
    const face: string = props.face
    const [showForm, setShowForm] = useState<boolean>(false)

    return (
        <>
            <h1 className={'text-center text-white d-block mx-auto pt-3 mt-4'}
                style={{ backgroundColor: generalBlue, minHeight: '80px', width: '80%' }}
            >
                Observaciones
            </h1>




            <button className={'btn btn-general-blue d-block m-auto mt-4'} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar' : 'Agregar Observación'}
            </button>

            {showForm &&
                <Container style={{ maxWidth: '600px' }}>
                    <Form>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label> Observación </Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Territorio</Form.Label>
                            <Form.Control
                                value={territory}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Manzana </Form.Label>
                            <Form.Control
                                value={block}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Cara </Form.Label>
                            <Form.Control
                                value={face}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3'}>
                            <Form.Label> Fecha </Form.Label>
                            <Form.Control
                                value={new Date(new Date().getTime() - (new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]}
                                disabled
                            />
                        </Form.Group>
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