import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { dark } from '../../models/territory'
import { MdDelete, MdEdit } from 'react-icons/md'
import { generalBlue } from '../_App'

export type typeNoTocar = {
    block: string,
    direccion: string,
    face: string,
    date: string
}

export const NoTocar = (props: any) => {

    const block: string = props.block
    const face: string = props.face
    const noTocarArray: typeNoTocar[] = props.noTocarArray
        .filter((noTocar: typeNoTocar) => noTocar.block === block && noTocar.face === face)
        .sort((a: typeNoTocar, b: typeNoTocar) => a.direccion.localeCompare(b.direccion))
    const [showForm, setShowForm] = useState<boolean>(false)

    const editNoTocarHandler = () => {
        
    }

    const deleteNoTocarHandler = () => {

    }

    return (
        <>
            <h1 className={'text-center text-white d-block mx-auto pt-3 mt-4'}
                style={{ backgroundColor: generalBlue, minHeight: '80px', width: '80%' }}
            >
                {!noTocarArray || !noTocarArray.length ? 'Listado de No Tocar' : 'No hay No Tocar en esta cara'}
            </h1>
                
            {noTocarArray && !!noTocarArray.length && noTocarArray.map((noTocar: typeNoTocar, index: number) => (
                <div key={index} className={'d-flex align-items-center justify-content-center mt-4'}>
                    <h2 className={'d-inline mr-2'}>
                        {noTocar.direccion} <small>({noTocar.date})</small>
                    </h2>
                    <MdEdit className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }} onClick={() => editNoTocarHandler()} />
                    &nbsp;
                    <MdDelete className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }} onClick={() => deleteNoTocarHandler()} />
                </div>
            ))}


            <button className={'btn btn-general-blue d-block m-auto mt-4'} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar' : 'Agregar No Tocar'}
            </button>

            {showForm &&
                <Container style={{ maxWidth: '600px' }}>
                    <Form.Group className={'mb-3'}>
                        <Form.Label> Calle </Form.Label>
                        <Form.Select>
                        <option>Directorio</option>
                        <option>Puán</option>
                        <option>Bonifacio</option>
                        <option>Miró</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className={'mb-3'}>
                        <Form.Label> Altura y timbre </Form.Label>
                        <Form.Control placeholder={'Altura y timbre'} />
                    </Form.Group>

                    <Form.Group className={'mb-3'}>
                        <Form.Label> Fecha </Form.Label>
                        <Form.Control
                            value={new Date(new Date().getTime() - (new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]}
                            disabled
                        />
                    </Form.Group>

                    <div className={''}>
                        <Button variant={dark} className={'float-right w-25'}> CANCELAR </Button>
                        <button className={'btn btn-general-blue float-right mr-2 w-50'}> ACEPTAR </button>
                    </div>
                </Container>
            }
        </>
    )
}
