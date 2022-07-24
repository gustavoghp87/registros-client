import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'
import { useAuth } from '../../context/authContext'
import { askForANewCampaignPackService, getCampaignPacksServiceByUser } from '../../services'
import { typeAppDispatch, typeCampaignPack, typeRootState, typeUser } from '../../models'

export const TerritoryCampaigneNumberBlock = () => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [campaignPacks, setCampaignPacks] = useState<typeCampaignPack[]>()
    const [showForm, setShowForm] = useState<boolean>(false)

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
            title: "¿Pedir un nuevo paquete de números?",
            message: "Se te asignará otro paquete de 50 números de inmediato",
            execution: askForANewCampaignPack
        }))
    }

    const askForANewCampaignPack = (): void => {
        askForANewCampaignPackService().then((success: boolean) => {
            if (!success) return openAlertModalHandler("Algo falló", "", () => window.location.reload())
            window.location.reload()
        })
    }

    useEffect(() => {
        if (user && user.isAuth)
            getCampaignPacksServiceByUser().then((campaignPacks0: typeCampaignPack[]|null) => {
                if (!campaignPacks0) return
                setCampaignPacks(campaignPacks0);
                if (campaignPacks0 === undefined || !campaignPacks0 || campaignPacks0?.length === 0) setShowForm(true)
                let someNotFinished: boolean = false
                for (let pack of campaignPacks0) {
                    if (!pack.terminado) someNotFinished = true
                }
                if (!someNotFinished) setShowForm(true)
            })
        return () => setCampaignPacks(undefined)
    }, [user])

    return (
    <>
        <div className={'container pt-0 mb-0'}>

            <Row style={{ padding: isMobile ? '40px' : '40px', justifyContent: 'space-evenly' }}>

                {user && user.isAuth && campaignPacks && !!campaignPacks.length && campaignPacks.map((campaignPack: typeCampaignPack, index: number) =>
                    <Link type={'button'} key={index}
                        className={`btn btn-success h-100 p-4 ${campaignPack.terminado ? 'd-none' : ''}`}
                        style={{
                            width: '140px',
                            borderRadius: '15px',
                            margin: '0 1% 0px 1%'
                        }}
                        to={`/celulares/${campaignPack?.id?.toString()}`}
                    >
                        <h2 className={'m-auto'}
                            style={{
                                fontFamily: '"Arial Black", Gadget, sans-serif',
                                fontSize: isMobile ? '2.3rem' : ''
                            }}
                        >
                            <span>{campaignPack?.id}</span>
                        </h2>
                    </Link>
                )}

                {((user && user.isAuth && (!campaignPacks || campaignPacks.length === 0)) || showForm) &&
                    <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                        No hay paquetes asignados <br /> Para recibir uno, hacer click en este botón:
                    </h3>
                }
            </Row>

            <Button
                className={`btn btn-success d-block m-auto mt-4 py-3 px-4 ${showForm ? '' : 'd-none'}`}
                onClick={() => openConfirmModalHandler()}
            >
                <span> Pedir un nuevo paquete de teléfonos <br /> para la Campaña de Celulares 2022 </span>
            </Button>

        </div>
    </>
    )
}