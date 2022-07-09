import { Button, Container, Form, Row } from "react-bootstrap"
import { useSelector } from "react-redux"
import { typeFace } from "../../models/houseToHouse"
import { dark, typeBlock, typeTerritoryNumber } from "../../models/territory"
import { typeRootState } from "../../store/store"


export const HTHForm = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const cancelFormHandler: Function = props.cancelFormHandler
    const isDoNotCallForm: boolean = props.isDoNotCallForm
    const submitHandler: Function = props.submitHandler
    const territory: typeTerritoryNumber = props.territory
    // do not call
    const block: typeBlock = props.block
    const date: string = props.date
    const doorBell: string = props.doorBell
    const face: typeFace = props.face
    const setDoorBellHandler: Function = props.setDoorBellHandler
    const setStreetHandler: Function = props.setStreetHandler
    const setStreetNumberHandler: Function = props.setStreetNumberHandler
    const streetNumber: number = props.streetNumber
    const streets: string[] = props.streets
    // observations
    const text: string = props.text
    const setTextHandler: Function = props.setTextHandler

    return (
        <Container className={'my-4'}
            style={{
                border: isDarkMode ? '1px solid white' : '1px solid lightgray',
                borderRadius: '7px',
                maxWidth: '600px'
            }}
        >
            <Form onSubmit={(e: any) => submitHandler(e)} className={`p-3 ${isDarkMode ? 'text-white' : ''}`}>

                <Form.Group className={'mb-3'}>
                    <Form.Label>
                        {isDoNotCallForm ? "Calle" : `Observación (${(160 - text?.length + 1 || 161) - 1})` }
                    </Form.Label>
                    {isDoNotCallForm ?
                        <Form.Select onChange={(e: any) => setStreetHandler(e.target.value)}>
                            <option> Seleccionar la calle </option>
                            {streets && !!streets.length && streets.map((currentStreet: string) => (
                                <option key={currentStreet} value={currentStreet}>{currentStreet}</option>
                            ))}
                        </Form.Select>
                        :
                        <Form.Control
                            as={'textarea'} 
                            rows={isMobile ? 6 : 3}
                            maxLength={160}
                            value={text}
                            autoFocus
                            onFocus={(e) => {
                                const val = e.target.value
                                e.target.value = ''
                                e.target.value = val
                            }}
                            onChange={(e: any) => setTextHandler(e.target.value)}
                        />
                    }
                </Form.Group>

                {isDoNotCallForm &&
                    <Row>
                        <Form.Group className={'mb-3 w-50'}>
                            <Form.Label> Altura </Form.Label>
                            <Form.Control
                                type={'number'}
                                min={0}
                                value={streetNumber ? streetNumber : ''}
                                onChange={(e: any) => setStreetNumberHandler(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3 w-50'}>
                            <Form.Label> Timbre </Form.Label>
                            <Form.Control
                                value={doorBell}
                                onChange={(e: any) => setDoorBellHandler(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                }

                <Row className={'mt-2'}>
                    <Form.Group className={`mb-3 ${isMobile ? 'w-50 mx-auto' : 'w-25'}`}>
                        <Form.Label> Territorio </Form.Label>
                        <Form.Control
                            value={territory}
                            disabled
                        />
                    </Form.Group>
                    
                    <Form.Group className={`mb-3 ${isMobile ? 'w-50 mx-auto' : 'w-25'}`}>
                        <Form.Label> Manzana </Form.Label>
                        <Form.Control
                            value={block}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group className={`mb-3 ${isMobile ? 'w-50 mx-auto' : 'w-25'}`}>
                        <Form.Label> Cara </Form.Label>
                        <Form.Control
                            value={face}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group className={`mb-3 ${isMobile ? 'w-50 mx-auto' : 'w-25'}`}>
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
                        <Button variant={dark} className={'d-block mx-auto'} onClick={() => cancelFormHandler()}> CANCELAR </Button>
                    </div>
                :
                    <div className={'pt-3'} style={{ minHeight: '70px' }}>
                        <Button variant={dark} className={'float-right w-25'} onClick={() => cancelFormHandler()}> CANCELAR </Button>
                        <button className={'btn btn-general-blue float-right mr-2 w-50'} type={'submit'}> ACEPTAR </button>
                    </div>
                }

            </Form>
        </Container>
    )
}