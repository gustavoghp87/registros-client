import { useState } from 'react'
import { Button, Container, Form, Row } from 'react-bootstrap'
import { dark, typeBlock, typeTerritoryNumber } from '../../models/territory'
import { typeDoNotCall, typeFace } from '../../models/houseToHouse'
import { typeUser } from '../../models/user'
import { typeRootState } from '../../store/store'
import { useAuth } from '../../context/authContext'
import { useSelector } from 'react-redux'
import { addHTHDoNotCallService } from '../../services/houseToHouseServices'

export const NoTocarHTHForm = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: typeTerritoryNumber = props.territory
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    const streets: string[] = props.streets
    const closeShowFormHandler: Function = props.closeShowFormHandler
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler

    const [street, setStreet] = useState<string>('')
    const [streetNumber, setStreetNumber] = useState<number>(0)
    const [doorBell, setDoorBell] = useState<string>('')
    
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
        if (!user || streetNumber < 1 || street === 'Seleccionar la calle') return
        const doNotCall: typeDoNotCall = {
            block,
            creator: user.email,
            date,
            doorBell,
            face,
            id: +new Date(),
            street,
            streetNumber
        }
        addHTHDoNotCallService(doNotCall, territory).then((success: boolean) => {
            if (success) {

            } else {
                
            }
        })
        closeShowFormHandler()
        refreshDoNotCallHandler()
        setStreet('')
        setStreetNumber(0)
        setDoorBell('')
    }

    const cancelForm = () => {
        closeShowFormHandler()
        setStreet('')
        setStreetNumber(0)
        setDoorBell('')
    }


    return (
        <Container className={'my-4'}
            style={{
                maxWidth: '600px',
                border: isDarkMode ? '1px solid white' : '1px solid lightgray',
                borderRadius: '7px'
            }}
        >
            <Form onSubmit={(e: any) => submitHandler(e)} className={`p-3 ${isDarkMode ? 'text-white' : ''}`}>

                <Form.Group className={'mb-3'}>
                    <Form.Label> Calle </Form.Label>
                    <Form.Select onChange={(e: any) => setStreet(e.target.value)}>
                        <option> Seleccionar la calle </option>
                        {streets && !!streets.length && streets.map((currentStreet: string) => (
                            <option key={currentStreet} value={currentStreet}>{currentStreet}</option>
                        ))}
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
                    <div className={'pt-3'} style={{ minHeight: '70px' }}>
                        <Button variant={dark} className={'float-right w-25'} onClick={cancelForm}> CANCELAR </Button>
                        <button className={'btn btn-general-blue float-right mr-2 w-50'} type={'submit'}> ACEPTAR </button>
                    </div>
                }

            </Form>
        </Container>
    )
}
