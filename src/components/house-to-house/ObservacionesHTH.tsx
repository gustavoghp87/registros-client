import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { dark } from '../../models/territory'
import { typeRootState } from '../../store/store'
import { generalBlue } from '../_App'

export type typeObservacion = {
    block: string
    date: string
    face: string
    id: string
    text: string
}


export const ObservacionesHTH = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: string = props.territory
    const block: string = props.block
    const face: string = props.face
    const observacionesArray: typeObservacion[] = props.observacionesArray
        .filter((observacion: typeObservacion) => observacion.block === block && observacion.face === face).reverse()
    const date = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
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
                {!observacionesArray || !observacionesArray.length ? 'Observaciones' : 'No hay Observaciones en esta cara'}
            </h1>




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