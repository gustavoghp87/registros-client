import { useState } from 'react'
import { Button, Container, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useAuth } from '../../context/authContext'
import { typeFace, typeObservation } from '../../models/houseToHouse'
import { dark, typeBlock, typeTerritoryNumber } from '../../models/territory'
import { typeUser } from '../../models/user'
import { addHTHObservationService } from '../../services/houseToHouseServices'
import { typeRootState } from '../../store/store'

export const ObservacionesHTHForm = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: typeTerritoryNumber = props.territory
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    const closeShowFormHandler: Function = props.closeShowFormHandler

    const [text, setText] = useState<string>('')
    
    const submitHandler = (e: Event) => {
        e.preventDefault()
        console.log("\n\nSubmitting")
        console.log("territory", territory)
        console.log("block", block)
        console.log("face", face)
        console.log("text", text)
        console.log("date", date)
        console.log("id", +new Date())
        if (!text || !user) return
        const observation: typeObservation = {
            block,
            creator: user.email,
            date,
            face,
            id: +new Date(),
            street: '',
            text
        }
        addHTHObservationService(observation, territory).then((success: boolean) => {
            if (success) {

            } else {
                
            }
        })
        closeShowFormHandler()
        refreshDoNotCallHandler()
        //setStreet('')
        setText('')
    }
    
    const cancelForm = () => {
        closeShowFormHandler()
        setText('')
    }


    return (
        <Container className={'my-4'}
            style={{ maxWidth: '600px', border: isDarkMode ? '1px solid white' : '1px solid lightgray', borderRadius: '7px' }}>

            <Form onSubmit={(e: any) => submitHandler(e)} className={`p-3 ${isDarkMode ? 'text-white' : ''}`}>

                <Form.Group className={'mb-3'} controlId={""}>
                    <Form.Label> Observación </Form.Label>
                    <Form.Control as={'textarea'} rows={3} value={text} onChange={(e: any) => setText(e.target.value)} />
                </Form.Group>

                <Row>
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
                            value={face ? face : 'Todas'}
                            disabled
                        />
                    </Form.Group>

                    {/* <Form.Group className={'mb-3 w-25'}>
                        <Form.Label> Calle </Form.Label>
                        <Form.Control
                            value={street ? street : 'Todas'}
                            disabled
                        />
                    </Form.Group> */}

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
                    <div className={'pt-3'} style={{ minHeight: '70px' }}>
                        <Button variant={dark} className={'float-right w-25'} onClick={cancelForm}> CANCELAR </Button>
                        <button className={'btn btn-general-blue float-right mr-2 w-50'} type={'submit'}> ACEPTAR </button>
                    </div>
                }

            </Form>
        </Container>
    )
}