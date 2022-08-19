import { useState, useEffect, useCallback } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { H2, Loading, WarningToaster } from '../commons'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../store'
import { editCampaignPackService, getCampaignPackService, closeCampaignPackService, putHyphens } from '../../services'
import { typeAppDispatch, typeCampaignPack, typeRootState } from '../../models'

export const CampaignPage = () => {

    const idString: string|undefined = useParams<string>()?.id
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const [campaignPack, setCampaignPack] = useState<typeCampaignPack>()
    const [phoneNumbers, setPhoneNumbers] = useState<number[]>()
    const [showToast, setShowToast] = useState(true)
    const id: number = idString ? parseInt(idString) : 0
    
    const openAlertModalHandler = useCallback((title: string, message: string, execution?: Function, animation?: number): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            execution,
            animation
        }))
    }, [dispatch])

    const openConfirmModalHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Marcar paquete como terminado?",
            message: "Este paquete te será desasignado y se informará al grupo de territorios que está terminado",
            execution: closeCampaignPackHandler
        }))
    }

    const editCampaignPackHandler = (phoneNumber: number, checked: boolean): void => {
        if (!campaignPack) return
        dispatch(showLoadingModalReducer())
        editCampaignPackService(phoneNumber, checked, id).then((campaignPack0: typeCampaignPack|null) => {
            dispatch(hideLoadingModalReducer())
            if (campaignPack0 && campaignPack0.isFinished) {
                openAlertModalHandler(
                    "¡Paquete terminado, felicitaciones!",
                    "Si no tienes otro, podrás solicitar uno más en la próxima pantalla si lo deseas",
                    () => navigate('/selector'),
                    1
                )
                return
            }
            if (!campaignPack0) {
                openAlertModalHandler(
                    "Error",
                    "No se pudo traer el paquete",
                    () => navigate('/selector'),
                    2
                )
                return
            }
            setCampaignPack(campaignPack0)
            let phones: number[] = []
            let i: number = 0
            while (i < 50) {
                phones.push(campaignPack0.from + i)
                i++
            }
            setPhoneNumbers(phones)
        })
    }

    const closeCampaignPackHandler = (): void => {
        closeCampaignPackService(id).then((success: boolean) => {
            if (!success) return openAlertModalHandler("Algo falló", "", undefined, 2)
            navigate('/selector')
        })
    }

    const PhoneChecker = (props: any): any => {
        const phoneNumber: number = parseInt(props.phoneNumber)
        return (
            <div className={'p-3 my-3 border border-primary rounded text-center'}>
                <h5 style={{ display: 'inline', fontSize: '2rem' }}>
                    <a href={`tel:${phoneNumber}`}> {putHyphens(phoneNumber)} </a>
                    &nbsp;&nbsp;
                </h5>
                <input className={'checkboxdos d-inline'}
                    checked={campaignPack && campaignPack.calledPhones.includes(phoneNumber)}
                    onChange={() => editCampaignPackHandler(phoneNumber, !campaignPack?.calledPhones.includes(phoneNumber))}
                    type={'checkbox'}
                />
            </div>
        )
    }

    const closeWarningToaster = (): void => setShowToast(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        if (!id) return
        dispatch(showLoadingModalReducer())
        getCampaignPackService(id).then((campaignPack0: typeCampaignPack|null) => {
            dispatch(hideLoadingModalReducer())
            if (campaignPack0 && campaignPack0.isFinished) {
                openAlertModalHandler(
                    "¡Paquete terminado, felicitaciones!",
                    "Si no tienes otro, podrás solicitar uno más en la próxima pantalla si lo deseas",
                    () => navigate('/selector'),
                    1
                )
                return
            }
            if (!campaignPack0) {
                openAlertModalHandler(
                    "Error",
                    "No se pudo traer el paquete",
                    () => navigate('/selector'),
                    2
                )
                return
            }
            setCampaignPack(campaignPack0)
            let phones: number[] = []
            let i: number = 0
            while (i < 50) {
                phones.push(campaignPack0.from + i)
                i++
            }
            setPhoneNumbers(phones)
        })
        return () => setCampaignPack(undefined)
    }, [dispatch, id, navigate, openAlertModalHandler])

    return (
    <>
        <H2 title={"CAMPAÑA CELULARES 2022"} />

        {!campaignPack && <Loading />}

        <h1 className={`text-center ${isDarkMode ? 'text-white' : ''}`}
            style={{ marginBottom: isMobile ? '30px' : '40px' }}
        >
            Paquete de teléfonos {id}
        </h1>

        {showToast &&
            <WarningToaster
                bodyText={"Estos registros serán eliminados al finalizar la campaña"}
                closeWarningToaster={closeWarningToaster}
                headerText={<strong>Campaña Celulares 2022</strong>}
                isCentered={true}
            />
        }

        {campaignPack && !!phoneNumbers?.length &&
            <>
                <button className={'btn btn-general-red d-block m-auto mt-4 mb-0 p-3'}
                    onClick={() => openConfirmModalHandler()}
                >
                    Marcar todos como terminados
                </button>

                <div style={{ display: 'block', margin: '40px auto' }}>
                    <Row>
                        <Col lg={4} sm={6}>
                            {phoneNumbers.slice(0, 17).map((phoneNumber: number, index: number) =>
                                <PhoneChecker key={index} phoneNumber={phoneNumber} />
                            )}
                        </Col>
                        <Col lg={4} sm={6}>
                            {phoneNumbers.slice(17, 34).map((phoneNumber: number, index: number) =>
                                <PhoneChecker key={index} phoneNumber={phoneNumber} />
                            )}
                        </Col>
                        <Col lg={4} sm={6}>
                            {phoneNumbers.slice(34).map((phoneNumber: number, index: number) =>
                                <PhoneChecker key={index} phoneNumber={phoneNumber} />
                            )}
                        </Col>
                    </Row>
                </div>
            </>
        }
    </>)
}
