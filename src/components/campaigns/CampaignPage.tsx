import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Button, Col, Row, Toast } from 'react-bootstrap'
import { ConfirmAlert } from '../commons/ConfirmAlert'
import { H2 } from '../css/css'
import { editCampaignPackService, getCampaignPackService, closeCampaignPackService } from '../../services/campaignServices'
import { putHyphens, isMobile } from '../../services/functions'
import { typeCampaignPack } from '../../models/campaign'
import { success } from '../../models/typesTerritorios'

export const CampaignPage = (props: any) => {

    const idString: string|undefined = useParams<string>()?.id
    const id: number = idString ? parseInt(idString) : 0
    const [showToast, setShowToast] = useState(true)
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)
    const [campaignPack, setCampaignPack] = useState<typeCampaignPack>()
    const [phoneNumbers, setPhoneNumbers] = useState<number[]>()
    const isDarkMode: string = props.isDarkMode
    
    const refresh = (): void => {    // rep
        getCampaignPackService(id).then((campaignPack: typeCampaignPack|null) => {
            if (!campaignPack || campaignPack.terminado || campaignPack.llamados?.length === 50) {
                return window.location.href = "/index"
            }
            setCampaignPack(campaignPack)
            let phones: number[] = []
            let i: number = 0
            while (i < 50) {
                phones.push(campaignPack?.desde + i)
                i++
            }
            setPhoneNumbers(phones)
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        getCampaignPackService(id).then((campaignPack: typeCampaignPack|null) => {
            if (!campaignPack || campaignPack.terminado || campaignPack.llamados?.length === 50) {
                return window.location.href = "/index"
            }
            setCampaignPack(campaignPack)
            let phones: number[] = []
            let i: number = 0
            while (i < 50) {
                phones.push(campaignPack?.desde + i)
                i++
            }
            setPhoneNumbers(phones)
        })
        return () => { setCampaignPack(undefined) }
    }, [id])

    const editCampaignPackHandler = (phoneNumber: number, checked: boolean): void => {
        let areThere49: boolean = false
        if (campaignPack?.llamados?.length === 49) areThere49 = true
        else areThere49 = false
        editCampaignPackService(phoneNumber, checked, id).then((success: boolean) => {
            if (success && !checked && areThere49) alert("¡Paquete terminado, felicitaciones! Si no tienes otro, podrás solicitar uno más en la próxima pantalla si lo deseas")
            else if (!success) alert("Algo falló")
            refresh()
        })
    }

    const markEverythingLikeCalled = (): void => {
        setShowConfirmAlertHandler()
        closeCampaignPackService(id).then(() => {
            if (!success) return alert("Algo falló")
            window.location.href = "/index"
        })
    }

    const setShowConfirmAlertHandler = (): void => setShowConfirmAlert(false)

    const PhoneChecker1 = (props: any): any => {
        const phoneNumber: number = parseInt(props.phoneNumber)
        const display: boolean = props.display
        return (
            <div className={`${display ? '' : 'd-none'} p-3 my-3 border border-primary rounded text-center`}>
                <h5 style={{ display: 'inline', fontSize: '2rem' }}>
                    <a href={`tel:${phoneNumber}`}> {putHyphens(phoneNumber)}</a>
                    &nbsp;&nbsp;
                </h5>
                <input className={'checkboxdos'} type={'checkbox'}
                    style={{ display: 'inline' }}
                    checked={(campaignPack && campaignPack.llamados && campaignPack.llamados.includes(phoneNumber)) ? true : false}
                    onChange={() => editCampaignPackHandler(phoneNumber, campaignPack && campaignPack.llamados && campaignPack.llamados.includes(phoneNumber) ? true : false)}
                />
            </div>
        )
    }


    return (
    <>
        {showConfirmAlert &&
            <ConfirmAlert
                show={false}
                title={"¿Marcar paquete como terminado?"}
                message={"Este paquete te será desasignado y se informará al grupo de territorios que está terminado"}
                execution={markEverythingLikeCalled}
                cancelAction={setShowConfirmAlertHandler}
            />
        }

        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.3rem' : '', marginBottom: isMobile ? '20px' : '', marginTop: isMobile ? '90px' : '' }}
        >
            CAMPAÑA CELULARES 2022
        </H2>

        <h1 className={isDarkMode ? 'text-white' : ''}
            style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '40px' }}>
            Paquete de teléfonos {id}
        </h1>

        <Toast show={showToast}
            className={'d-block m-auto'}
            style={{ border: '1px solid lightgray', marginBottom: '50px' }}
            onClose={() => setShowToast(false)}>
          <Toast.Header style={{ border:'1px solid lightgray' }}>
            <strong className={'mr-auto'}> Campaña Celulares 2022 </strong>
            <small> </small>
          </Toast.Header>
          <Toast.Body> Estos registros serán eliminados al finalizar la campaña </Toast.Body>
        </Toast>

        <Button className={`btn btn-danger d-block m-auto mt-4 mb-0 p-3 ${campaignPack?.terminado ? '' : ''}`}
            onClick={() => setShowConfirmAlert(!showConfirmAlert)}>
            Marcar todos como terminados
        </Button>

        <div style={{ display: 'block', margin: isMobile ? '40px auto' : '40px auto' }}>
            <Row>
                <Col lg={4} sm={6}>
                    {phoneNumbers && !!phoneNumbers.length && phoneNumbers.map((phoneNumber: number, index: number) => (
                        <div key={index}>
                            <PhoneChecker1 phoneNumber={phoneNumber} display={index < 17} />
                        </div>
                    ))}
                </Col>
                <Col lg={4} sm={6}>
                    {phoneNumbers && !!phoneNumbers.length && phoneNumbers.map((phoneNumber: number, index: number) => (
                        <div key={index}>
                            <PhoneChecker1 phoneNumber={phoneNumber} display={index > 16 && index < 34} />
                        </div>
                    ))}
                </Col>
                <Col lg={4} sm={6}>
                    {phoneNumbers && !!phoneNumbers.length && phoneNumbers.map((phoneNumber: number, index: number) => (
                        <div key={index}>
                            <PhoneChecker1 phoneNumber={phoneNumber} display={index > 33} />
                        </div>
                    ))}
                </Col>
            </Row>
        </div>
    </>
    )
}
