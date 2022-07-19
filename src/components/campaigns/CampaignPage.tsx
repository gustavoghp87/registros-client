import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router'
import { Button, Col, Row, Toast } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'
import { editCampaignPackService, getCampaignPackService, closeCampaignPackService, putHyphens } from '../../services'
import { success, typeAppDispatch, typeCampaignPack, typeRootState } from '../../models'
import { H2 } from '../css/css'

export const CampaignPage = () => {

    const idString: string|undefined = useParams<string>()?.id
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [campaignPack, setCampaignPack] = useState<typeCampaignPack>()
    const [phoneNumbers, setPhoneNumbers] = useState<number[]>()
    const [showToast, setShowToast] = useState(true)
    const id: number = idString ? parseInt(idString) : 0
    
    const openAlertModalHandler = (title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            execution
        }))
    }

    const openConfirmModalHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Marcar paquete como terminado?",
            message: "Este paquete te será desasignado y se informará al grupo de territorios que está terminado",
            execution: closeCampaignPackHandler
        }))
    }

    const editCampaignPackHandler = (phoneNumber: number, checked: boolean): void => {
        let areThere49: boolean = false
        if (campaignPack?.llamados?.length === 49) areThere49 = true
        editCampaignPackService(phoneNumber, checked, id).then((success: boolean) => {
            if (success && !checked && areThere49)
                openAlertModalHandler("¡Paquete terminado, felicitaciones!", "Si no tienes otro, podrás solicitar uno más en la próxima pantalla si lo deseas", refreshHandler)
            else if (!success)
                openAlertModalHandler("Algo falló", "", refreshHandler)
            else
                refreshHandler()
        })
    }

    const closeCampaignPackHandler = (): void => {
        closeCampaignPackService(id).then(() => {
            if (!success) return openAlertModalHandler("Algo falló", "")
            window.location.href = '/index'
        })
    }

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

    const refreshHandler = useCallback((): void => {
        if (id) getCampaignPackService(id).then((campaignPack: typeCampaignPack|null) => {
            if (!campaignPack || campaignPack.terminado || campaignPack.llamados?.length === 50) {
                return window.location.href = '/index'
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
    }, [id])

    useEffect(() => {
        window.scrollTo(0, 0)
        refreshHandler()
        return () => setCampaignPack(undefined)
    }, [refreshHandler])

    return (
    <>
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
            <Toast.Header style={{ border: '1px solid lightgray' }}>
                <strong className={'mr-auto'}> Campaña Celulares 2022 </strong>
                <small> </small>
            </Toast.Header>
            <Toast.Body> Estos registros serán eliminados al finalizar la campaña </Toast.Body>
        </Toast>

        <Button className={`btn btn-danger d-block m-auto mt-4 mb-0 p-3 ${campaignPack?.terminado ? '' : ''}`}
            onClick={() => openConfirmModalHandler()}>
            Marcar todos como terminados
        </Button>

        <div style={{ display: 'block', margin: '40px auto' }}>
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
