import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Col, Row, SplitButton, Dropdown, Button } from 'react-bootstrap'
import { H2, Loading } from '../commons'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { getCampaignPacksService, closeCampaignPackService, assignCampaignPackByEmailService, enableAccesibilityModeService, putHyphens } from '../../services'
import { getUsersService } from '../../services/userServices'
import { noAsignado, typeAppDispatch, typeCampaignPack, typeRootState, typeUser } from '../../models'

export const Campaign = (props: any) => {
    
    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const setIsLoading: Function = props.setIsLoading
    const [campaignPacks, setCampaignPacks] = useState<typeCampaignPack[]>()
    const [showFiltered, setShowFiltered] = useState(false)
    const [users, setUsers] = useState<typeUser[]>()
    let id: number = 0

    const refreshHandler = (): void => {
        setIsLoading(true)
        getCampaignPacksService().then((campaignPacks: typeCampaignPack[]|null) => {
            setIsLoading(false)
            if (campaignPacks) setCampaignPacks(campaignPacks)
        })
    }

    const openAlertModalHandler = (title: string, message: string, animation?: number): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation
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
        if (!id) return
        setIsLoading(true)
        closeCampaignPackService(id).then((success: boolean) => {
            setIsLoading(false)
            if (!success) return openAlertModalHandler("Algo falló", "", 2)
            refreshHandler()
        })
    }

    const assignCampaignPackByEmailHandler = async (id: number, email: string) => {
        if (!id || !email) return
        setIsLoading(true)
        assignCampaignPackByEmailService(id, email).then((success: boolean) => {
            setIsLoading(false)
            if (!success) return openAlertModalHandler("Algo falló", "", 2)
            refreshHandler()
        })
    }

    const enableAccesibilityModeHandler = (id: number, accessible: boolean): void => {
        setIsLoading(true)
        enableAccesibilityModeService(id, accessible).then((success: boolean) => {
            setIsLoading(false)
            if (!success) return openAlertModalHandler("Algo falló", "", 2)
            refreshHandler()
        })
    }
    
    useEffect(() => {
        getUsersService().then((users: typeUser[]|null) => {
            if (!users) return
            users.sort((a: typeUser, b: typeUser) => a.email.localeCompare(b.email))
            setUsers(users)
        })
        getCampaignPacksService().then((campaignPacks0: typeCampaignPack[]|null) => {
            if (!campaignPacks0) return
            setCampaignPacks(campaignPacks0)
        })
    }, [])

    return (
    <>
        <H2 title={"CAMPAÑA CELULARES 2022"} />

        {(!users || !users.length || !campaignPacks || !campaignPacks.length) &&
            <Loading mt={'50px'} />
        }

        {campaignPacks && !!campaignPacks.length &&
            <button className={`btn ${showFiltered ? 'btn-general-blue' : 'btn-general-red'} d-block mx-auto mt-5`}
                onClick={() => setShowFiltered(x => !x)}
            >
                {showFiltered ? 'Ver todos' : 'Ver solo No Asignados No Terminados'}
            </button>
        }

        <div style={{ margin: '80px auto' }}>
            {users && !!users.length && campaignPacks && !!campaignPacks.length && campaignPacks.map((campaignPack: typeCampaignPack) => {
                
                let filtered = false
                if (showFiltered && ((campaignPack.assignedTo !== noAsignado) || campaignPack.isFinished)) filtered = true
                
                return (

                <Card key={campaignPack.id}
                    className={`pt-2 py-3 mb-4 text-white ${campaignPack.isFinished ? 'bg-info' : 'bg-dark'}`}
                    style={{ display: filtered ? 'none' : '' }}
                >
                    <Card.Body>
                        <Row>
                            <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                <br />
                                <h3> Paquete {campaignPack.id} </h3>
                                {/* <h4> Grupo de paquetes: {campaignPack.paquete} </h4> */}
                                <h4> {putHyphens(campaignPack.from)} </h4>
                                <h4> {putHyphens(campaignPack.to)} </h4>
                            </Col>

                            <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                <h4> Asignado a: </h4>
                                <SplitButton
                                    variant={(campaignPack.assignedTo !== noAsignado) ? 'primary' : 'danger'}
                                    className={'mt-2'}
                                    title={campaignPack.assignedTo ? campaignPack.assignedTo : noAsignado}
                                >
                                    <Dropdown.Item onClick={() => assignCampaignPackByEmailHandler(campaignPack.id, 'Nadie')}>
                                        Nadie
                                    </Dropdown.Item>

                                    <Dropdown.Item onClick={() => assignCampaignPackByEmailHandler(campaignPack.id, 'Alguien sin cuenta')}>
                                        Alguien sin cuenta
                                    </Dropdown.Item>

                                    <Dropdown.Divider />
                                    
                                    {users.map((user: typeUser, index: number) => (
                                        <Dropdown.Item key={user.email}
                                            eventKey={index.toString()}
                                            onClick={() => assignCampaignPackByEmailHandler(campaignPack.id, user.email)}>
                                            {user.email}
                                        </Dropdown.Item>
                                    ))}
                                    
                                </SplitButton>

                                <br/>
                                <br/>

                                {!campaignPack.isFinished &&
                                    <Button
                                        onClick={() => { openConfirmModalHandler(campaignPack.id) }}
                                        variant={'secondary'}
                                    >
                                        Marcar como terminado
                                    </Button>
                                }
                            </Col>

                            <Col md={4} className={'text-center'} style={{ marginBottom: isMobile ? '15px' : '' }}>
                                <h4 className={'mt-3 mb-2'}>
                                    {campaignPack.isFinished ? "TERMINADO" : "NO TERMINADO"}
                                </h4>
                                <h4>
                                    Llamados: {campaignPack.isFinished ? '50' : campaignPack.calledPhones.length}
                                </h4>
                                <Button
                                    className={`mt-2 ${campaignPack.isFinished ? 'd-none' : ''}`}
                                    onClick={() => enableAccesibilityModeHandler(campaignPack.id, !campaignPack.isAccessible)}
                                    variant={campaignPack.isAccessible ? 'primary' : 'danger'}
                                >
                                    {campaignPack.isAccessible ? "Paquete accesible" : "Habilitar accesibilidad"}
                                </Button>
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>
                )
            })}
        </div>
    </>
    )
}
