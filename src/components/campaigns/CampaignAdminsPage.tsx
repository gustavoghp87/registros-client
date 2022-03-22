import { useState, useEffect } from 'react'
import { Card, Col, Row, SplitButton, Dropdown, Button } from 'react-bootstrap'
import { Loading } from '../commons/Loading'
import { ConfirmAlert } from '../commons/ConfirmAlert'
import { H2 } from '../css/css'
import { putHyphens, isMobile } from '../../services/functions'
import { getUsersService } from '../../services/userServices'
import { getCampaignPacksService, closeCampaignPackService, assignCampaignPackByEmailService, enableAccesibilityModeService } from '../../services/campaignServices'
import { typeCampaignPack } from '../../models/campaign'
import { typeUser } from '../../models/typesUsuarios'
import { danger, noAsignado, primary, secondary } from '../../models/typesTerritorios'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const CampaignAdminsPage = (props: any) => {
    const [users, setUsers] = useState<typeUser[]>()
    const [campaignPacks, setCampaignPacks] = useState<typeCampaignPack[]>()
    const [showFiltered, setShowFiltered] = useState(false)
    const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
    const [id, setId] = useState<number>()
    const isDarkMode: string = props.isDarkMode

    
    useEffect(() => {
        getUsersService().then((users: typeUser[]|null) => {
            if (users) {
                users.sort((a: typeUser, b: typeUser) => a.email.localeCompare(b.email))
                setUsers(users)
            }
        })
        refreshHandler()
    }, [])

    const refreshHandler = (): void => {
        getCampaignPacksService().then((campaignPacks: typeCampaignPack[]|null) => { if (campaignPacks) setCampaignPacks(campaignPacks) })
    }

    const closeCampaignPackHandler = async () => {
        closeConfirmAlertHandler()
        if (id) closeCampaignPackService(id).then((success: boolean) => {
            if (!success) return alert("Algo falló")
            refreshHandler()
        })
    }

    const closeConfirmAlertHandler = (): void => setShowConfirmAlert(false)

    const assignCampaignPackByEmailHandler = async (id: number, email: string) => {
        assignCampaignPackByEmailService(id, email).then((success: boolean) => {
            if (!success) return alert("Algo falló")
            refreshHandler()
        })
    }

    const enableAccesibilityModeHandler = (id: number, accessible: boolean): void => {
        enableAccesibilityModeService(id, accessible).then((success: boolean) => { if (success) refreshHandler() })
    }
    

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.2rem' : '', marginBottom: isMobile ? '20px' : '' }}
        >
            CAMPAÑA CELULARES 2022
        </H2>

        {showConfirmAlert &&
            <ConfirmAlert
                title={`¿Confirmar marcar este paquete como terminado`}
                message={`El paquete ${id} será desasignado y dado por terminado`}
                execution={closeCampaignPackHandler}
                cancelAction={closeConfirmAlertHandler}
            />
        }

        <Button variant={showFiltered ? primary : danger} style={{ display: 'block', margin: '30px auto 0 auto' }}
            onClick={() => setShowFiltered(!showFiltered)}>
            {showFiltered ? 'Ver todos' : 'Ver solo No Asignados No Terminados'}
        </Button>

        <div style={{ margin: '80px auto' }}>

            {users && !!users.length && campaignPacks && !!campaignPacks.length &&
                campaignPacks.map((campaignPack: typeCampaignPack) => {
                    let filtered = false
                    if (showFiltered && ((campaignPack?.asignado && campaignPack?.asignado !== noAsignado) || campaignPack?.terminado)) filtered = true
                    
                    return (

                    <Card key={campaignPack?.id}
                        className={`pt-2 py-3 mb-4 text-white ${campaignPack?.terminado ? 'bg-info' : 'bg-dark'}`}
                        style={{ display: filtered ? 'none' : '' }}
                    >
                        <Card.Body>
                            <Row>
                                <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                    <br />
                                    <h3> Paquete {campaignPack?.id} </h3>
                                    {/* <h4> Grupo de paquetes: {campaignPack?.paquete} </h4> */}
                                    <h4> {putHyphens(campaignPack?.desde)} </h4>
                                    <h4> {putHyphens(campaignPack?.al)} </h4>
                                </Col>

                                <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                    <h4> Asignado a: </h4>
                                    <SplitButton id={'1'}
                                        variant={(!campaignPack?.asignado || campaignPack?.asignado === noAsignado) ? primary : danger}
                                        className={'mt-2'}
                                        title={campaignPack?.asignado ? campaignPack?.asignado : noAsignado}
                                    >
                                        <Dropdown.Item key={0} eventKey={'0'} onClick={() => assignCampaignPackByEmailHandler(campaignPack?.id, 'Nadie')}>
                                            Nadie
                                        </Dropdown.Item>
                                        <Dropdown.Item key={0} eventKey={'0'} onClick={() => assignCampaignPackByEmailHandler(campaignPack?.id, 'Alguien sin cuenta')}>
                                            Alguien sin cuenta
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        {users.map((user: typeUser, index: number) => (
                                            <Dropdown.Item key={index}
                                                eventKey={index.toString()}
                                                onClick={() => assignCampaignPackByEmailHandler(campaignPack?.id, user.email)}>
                                                {user.email}
                                            </Dropdown.Item>
                                        ))}
                                    </SplitButton>

                                    <br/>
                                    <br/>

                                    <Button variant={secondary}
                                        style={{ display: campaignPack?.terminado ? 'none' : '' }}
                                        onClick={() => { setId(campaignPack?.id); setShowConfirmAlert(!showConfirmAlert) }}
                                    >
                                        Marcar como terminado
                                    </Button>
                                </Col>

                                <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                    
                                    <h4 className={'mt-3 mb-2'}> {campaignPack?.terminado ? "TERMINADO" : "NO TERMINADO"} </h4>
                                    <h4> Llamados: {campaignPack?.terminado ? '50' : campaignPack?.llamados ? campaignPack?.llamados.length : '0'} </h4>
                                    <Button variant={campaignPack?.accessible ? primary : danger}
                                        className={`mt-2 ${campaignPack?.terminado ? 'd-none' : ''}`}
                                        onClick={() => enableAccesibilityModeHandler(campaignPack?.id, !campaignPack?.accessible)}>
                                        {campaignPack?.accessible ? "Paquete accesible" : "Habilitar accesibilidad"}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    )
                })
            }

            {(!users || !users.length) && <Loading />}

            {(!campaignPacks || !campaignPacks.length) && <Loading />}

        </div>
    </>
    )
}
