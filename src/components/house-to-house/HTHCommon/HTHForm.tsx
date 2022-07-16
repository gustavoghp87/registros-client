import { Button, Container, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typePolygon } from '../../../models/houseToHouse'
import { dark, typeTerritoryNumber } from '../../../models/territory'
import { typeRootState } from '../../../store/store'

export const HTHForm = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const cancelFormHandler: Function = props.cancelFormHandler
    const currentFace: typePolygon = props.currentFace
    const date: string = props.date
    const isDoNotCallForm: boolean = props.isDoNotCallForm
    const submitHandler: Function = props.submitHandler
    const territory: typeTerritoryNumber = props.territory
    
    // do not call
    const doorBell: string = props.doorBell
    const setDoorBellHandler: Function = props.setDoorBellHandler
    const setStreetNumberHandler: Function = props.setStreetNumberHandler
    const streetNumber: number = props.streetNumber
    
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

                <Form.Group
                    className={'mb-3 w-50'}
                >
                    <Form.Label> Calle </Form.Label>
                    <Form.Control
                        value={currentFace.street}
                        disabled
                    />
                </Form.Group>

                {isDoNotCallForm ?
                    <Row>
                        <Form.Group className={'mb-3 w-50'}>
                            <Form.Label> Altura </Form.Label>
                            <Form.Control
                                type={'number'}
                                min={0}
                                value={streetNumber ? streetNumber : ''}
                                onChange={(e: any) => setStreetNumberHandler(e.target.value)}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3 w-50'}>
                            <Form.Label> Timbre </Form.Label>
                            <Form.Control
                                value={doorBell ?? ''}
                                onChange={(e: any) => setDoorBellHandler(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    :
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Observación ({(160 - text?.length + 1 || 161) - 1})
                        </Form.Label>
                        <Form.Control
                            as={'textarea'} 
                            autoFocus
                            maxLength={160}
                            onChange={(e: any) => setTextHandler(e.target.value)}
                            onFocus={(e) => {
                                const val: string = e.target.value
                                e.target.value = ''
                                e.target.value = val
                            }}
                            rows={isMobile ? 6 : 3}
                            value={text}
                        />
                    </Form.Group>
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
                            value={currentFace.block}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group className={`mb-3 ${isMobile ? 'w-50 mx-auto' : 'w-25'}`}>
                        <Form.Label> Cara </Form.Label>
                        <Form.Control
                            value={currentFace.face}
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
