import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Button } from 'react-bootstrap'
import { ConfirmAlert } from '../commons/ConfirmAlert'
import { useAuth } from '../../context/authContext'
import { isMobile } from '../../services/functions'
import { askForANewCampaignPackService, getCampaignPacksServiceByUser } from '../../services/campaignServices'
import { typeUser } from '../../models/typesUsuarios'
import { typeCampaignPack } from '../../models/campaign'

export const TerritoryCampaigneNumberBlock = () => {

    const user: typeUser|undefined = useAuth().user
    const [showForm, setShowForm] = useState<boolean>(false)
    const [campaignPacks, setCampaignPacks] = useState<typeCampaignPack[]>()
    const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
    
    useEffect(() => {
        if (user && user.isAuth)
            getCampaignPacksServiceByUser().then((campaignPacks0: typeCampaignPack[]|null) => {
                if (campaignPacks0) {
                    setCampaignPacks(campaignPacks0);
                    if (campaignPacks0 === undefined || !campaignPacks0 || campaignPacks0?.length === 0) setShowForm(true)
                    let someNotFinished: boolean = false
                    for (let pack of campaignPacks0) {
                        if (!pack.terminado) someNotFinished = true
                    }
                    if (!someNotFinished) setShowForm(true)
                }
            })
        return () => setCampaignPacks(undefined)
    }, [user])

    const askForANewCampaignPack = (): void => {
        setShowConfirmAlertHandler()
        askForANewCampaignPackService().then((success: boolean) => {
            if (!success) alert("Algo falló")
            window.location.reload()
        })
    }

    const setShowConfirmAlertHandler = (): void => setShowConfirmAlert(false)


    return (
    <>
        {showConfirmAlert &&
            <ConfirmAlert
                show={false}
                title={"¿Pedir un nuevo paquete de números?"}
                message={"Se te asignará otro paquete de 50 números de inmediato"}
                execution={askForANewCampaignPack}
                cancelAction={setShowConfirmAlertHandler}
            />
        }
        
        <div className={'container'} style={{ paddingTop: '0', marginBottom: '50px' }}>

            <Row style={{ padding: isMobile ? '40px' : '70px 40px 0px 40px', justifyContent: 'space-evenly' }}>

                {user && user.isAuth && campaignPacks && !!campaignPacks.length && campaignPacks.map((campaignPack: typeCampaignPack, index: number) =>
                    <Link type={'button'} key={index}
                        className={`btn btn-success h-100 p-4 ${campaignPack.terminado ? 'd-none' : ''}`}
                        style={{
                            width: '140px',
                            borderRadius: '15px',
                            margin: '0 1% 40px 1%'
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
                    <h3 className={'text-center mb-4'}>
                        No hay paquetes asignados <br /> Para recibir otro, hacer click en este botón:
                    </h3>
                }
            </Row>

            <Button className={`btn btn-success d-block m-auto mt-4 py-3 px-4 ${showForm ? '' : 'd-none'}`} onClick={() => setShowConfirmAlert(true)}>
                <span>Pedir un nuevo paquete de teléfonos <br /> para la campaña de celulares 2022</span>
            </Button>

            {/* <iframe src={"https://docs.google.com/forms/d/e/1FAIpQLScVMHycd-GYYMnPvQxuCaKB1mhS7gykuGqvbaxvYW3Dn-oNLw/viewform?embedded=true"}
                    className={`mt-4 ${showForm ? '' : 'd-none'}`}
                    title={"Campaña Celulares 2022"}
                    width={"100%"}
                    height={"1200"}
                    frameBorder={"0"}
                    marginHeight={0}
                    marginWidth={0}
            >
                Cargando...
            </iframe> */}
        </div>
    </>
    )
}