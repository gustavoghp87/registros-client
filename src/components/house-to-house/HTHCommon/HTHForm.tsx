import { Button, Container, Form, Row } from 'react-bootstrap'
import { FC, FormEvent } from 'react'
import { typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    cancelFormHandler: () => void
    currentFace: typePolygon
    date: string
    isDoNotCallForm: boolean
    submitHandler: (e: FormEvent<HTMLFormElement>) => void
    territoryNumber: typeTerritoryNumber
    // do not call
    doorBell?: string
    setDoorBellHandler?: (doorBell: string) => void
    setStreetNumberHandler?: (streetNumber: number) => void
    streetNumber?: number
    // observations
    text?: string
    setTextHandler?: (text: string) => void
}

export const HTHForm: FC<propsType> = ({
    cancelFormHandler, currentFace, date, doorBell, isDoNotCallForm,
    setDoorBellHandler, setStreetNumberHandler, setTextHandler,
    streetNumber, submitHandler, territoryNumber, text
}) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))

    return (
        <Container className={'my-4'}
            style={{
                border: isDarkMode ? '1px solid white' : '1px solid lightgray',
                borderRadius: '7px',
                maxWidth: '600px'
            }}
        >
            <Form onSubmit={e => submitHandler(e)} className={`p-3 ${isDarkMode ? 'text-white' : ''}`}>

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
                                onChange={e => setStreetNumberHandler ? setStreetNumberHandler(parseInt(e.target.value)) : null}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className={'mb-3 w-50'}>
                            <Form.Label> Timbre </Form.Label>
                            <Form.Control
                                value={doorBell ?? ''}
                                onChange={e => setDoorBellHandler ? setDoorBellHandler(e.target.value) : null}
                            />
                        </Form.Group>
                    </Row>
                    :
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Observación ({(160 - (text ?? '').length + 1 || 161) - 1})
                        </Form.Label>
                        <Form.Control
                            as={'textarea'} 
                            autoFocus
                            maxLength={160}
                            onChange={e => setTextHandler ? setTextHandler(e.target.value) : null}
                            onFocus={e => {
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
                            value={territoryNumber}
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
                        <button className={'btn btn-general-blue w-100 mb-3'}> ACEPTAR </button>
                        <Button variant={'dark'} className={'w-100'} onClick={() => cancelFormHandler()}> CANCELAR </Button>
                    </div>
                :
                    <div className={'pt-3'} style={{ minHeight: '70px' }}>
                        <Button variant={'dark'} className={'float-end w-25'} onClick={() => cancelFormHandler()}> CANCELAR </Button>
                        <button className={'btn btn-general-blue float-end me-2 w-50'}> ACEPTAR </button>
                    </div>
                }

            </Form>
        </Container>
    )
}
