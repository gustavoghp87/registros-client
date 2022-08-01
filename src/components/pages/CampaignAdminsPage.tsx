import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Col, Row, SplitButton, Dropdown, Button } from 'react-bootstrap'
import { H2, Loading } from '../commons'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { getCampaignPacksService, closeCampaignPackService, assignCampaignPackByEmailService, enableAccesibilityModeService, putHyphens } from '../../services'
import { noAsignado, typeAppDispatch, typeCampaignPack, typeRootState, typeUser } from '../../models'
import { getUsersService } from '../../services/userServices'

export const CampaignAdminsPage = () => {
    
    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [campaignPacks, setCampaignPacks] = useState<typeCampaignPack[]>()
    const [showFiltered, setShowFiltered] = useState(false)
    const [users, setUsers] = useState<typeUser[]>()
    let id: number = 0

    const refreshHandler = (): void => {
        getCampaignPacksService().then((campaignPacks: typeCampaignPack[]|null) => {
            if (campaignPacks) setCampaignPacks(campaignPacks)
        })
    }

    const openAlertModalHandler = (title: string, message: string): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message
        }))
    }

    const openConfirmModalHandler = (selecterId: number): void => {
        id = selecterId
        if (!id) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: `¿Confirmar marcar este paquete como terminado`,
            message: `El paquete ${id} será desasignado y dado por terminado`,
            execution: closeCampaignPackHandler
        }))
    }

    const closeCampaignPackHandler = async () => {
        if (id) closeCampaignPackService(id).then((success: boolean) => {
            if (!success) return openAlertModalHandler("Algo falló", "")
            refreshHandler()
        })
    }

    const assignCampaignPackByEmailHandler = async (id: number, email: string) => {
        if (id && email) assignCampaignPackByEmailService(id, email).then((success: boolean) => {
            if (!success) return openAlertModalHandler("Algo falló", "")
            refreshHandler()
        })
    }

    const enableAccesibilityModeHandler = (id: number, accessible: boolean): void => {
        enableAccesibilityModeService(id, accessible).then((success: boolean) => {
            if (!success) return openAlertModalHandler("Algo falló", "")
            refreshHandler()
        })
    }
    
    useEffect(() => {
        getUsersService().then((users: typeUser[]|null) => {
            if (users) {
                users.sort((a: typeUser, b: typeUser) => a.email.localeCompare(b.email))
                setUsers(users)
            }
        })
        refreshHandler()
    }, [])

    return (
    <>
        <H2 title={"CAMPAÑA CELULARES 2022"} />

        {campaignPacks && !!campaignPacks.length &&
            <button className={`btn ${showFiltered ? 'btn-general-blue' : 'btn-general-red'} d-block mx-auto mt-5`}
                onClick={() => setShowFiltered(!showFiltered)}
            >
                {showFiltered ? 'Ver todos' : 'Ver solo No Asignados No Terminados'}
            </button>
        }

        <div style={{ margin: '80px auto' }}>
            {users && !!users.length && campaignPacks && !!campaignPacks.length && campaignPacks.map((campaignPack: typeCampaignPack) => {
                let filtered = false
                if (showFiltered && ((campaignPack.asignado && campaignPack.asignado !== noAsignado) || campaignPack.terminado)) filtered = true
                
                return (

                <Card key={campaignPack.id}
                    className={`pt-2 py-3 mb-4 text-white ${campaignPack.terminado ? 'bg-info' : 'bg-dark'}`}
                    style={{ display: filtered ? 'none' : '' }}
                >
                    <Card.Body>
                        <Row>
                            <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                <br />
                                <h3> Paquete {campaignPack.id} </h3>
                                {/* <h4> Grupo de paquetes: {campaignPack.paquete} </h4> */}
                                <h4> {putHyphens(campaignPack.desde)} </h4>
                                <h4> {putHyphens(campaignPack.al)} </h4>
                            </Col>

                            <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                <h4> Asignado a: </h4>
                                <SplitButton
                                    variant={(!campaignPack.asignado || campaignPack.asignado === noAsignado) ? 'primary' : 'danger'}
                                    className={'mt-2'}
                                    title={campaignPack.asignado ? campaignPack.asignado : noAsignado}
                                >
                                    <Dropdown.Item onClick={() => assignCampaignPackByEmailHandler(campaignPack.id, 'Nadie')}>
                                        Nadie
                                    </Dropdown.Item>

                                    <Dropdown.Item onClick={() => assignCampaignPackByEmailHandler(campaignPack.id, 'Alguien sin cuenta')}>
                                        Alguien sin cuenta
                                    </Dropdown.Item>

                                    <Dropdown.Divider />
                                    
                                    {users.map((user: typeUser, index: number) => (
                                        <Dropdown.Item key={index}
                                            eventKey={index.toString()}
                                            onClick={() => assignCampaignPackByEmailHandler(campaignPack.id, user.email)}>
                                            {user.email}
                                        </Dropdown.Item>
                                    ))}
                                    
                                </SplitButton>

                                <br/>
                                <br/>

                                <Button variant={'secondary'}
                                    style={{ display: campaignPack.terminado ? 'none' : '' }}
                                    onClick={() => { openConfirmModalHandler(campaignPack.id) }}
                                >
                                    Marcar como terminado
                                </Button>
                            </Col>

                            <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                <h4 className={'mt-3 mb-2'}>
                                    {campaignPack.terminado ? "TERMINADO" : "NO TERMINADO"}
                                </h4>
                                <h4>
                                    Llamados: {campaignPack.terminado ? '50' : campaignPack.llamados ? campaignPack.llamados.length : '0'}
                                </h4>
                                <Button variant={campaignPack.accessible ? 'primary' : 'danger'}
                                    className={`mt-2 ${campaignPack.terminado ? 'd-none' : ''}`}
                                    onClick={() => enableAccesibilityModeHandler(campaignPack.id, !campaignPack.accessible)}
                                >
                                    {campaignPack.accessible ? "Paquete accesible" : "Habilitar accesibilidad"}
                                </Button>
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>
                )
            })}

            {(!users || !users.length || !campaignPacks || !campaignPacks.length) &&
                <Loading mt={20} />
            }

        </div>
    </>
    )
}
