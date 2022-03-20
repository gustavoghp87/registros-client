import { useState, useEffect } from 'react'
import { Card, Button, ListGroup } from 'react-bootstrap'
import { Loading } from './commons/Loading'
import { generalBlue } from './_App'
import { H2 } from './css/css'
import { isMobile } from '../services/functions'
import { getAllLogsService } from '../services/logServices'
import { typeLog, typeLogsObj } from '../models/log'

export const LogsPage = (props: any) => {
    
    const isDarkMode: string = props?.isDarkMode
    const [logs, setLogs] = useState<typeLogsObj>()
    const [showCampaignAssignments, setShowCampaignAssignments] = useState<boolean>(false)
    const [showCampaignFinishing, setShowCampaignFinishing] = useState<boolean>(false)
    const [showErrors, setShowErrors] = useState<boolean>(false)
    const [showLogins, setShowLogins] = useState<boolean>(false)
    const [showStateChanges, setShowStateChanges] = useState<boolean>(false)
    const [showPreaching, setShowPreaching] = useState<boolean>(false)
    const [showUserChanges, setShowUserChanges] = useState<boolean>(false)

    useEffect(() => {
        getAllLogsService().then((logsObject: typeLogsObj|null) => {
            if (logsObject) setLogs(logsObject)
        })
    }, [])

    const LogsCard = (props: any) => (
        <Card className={`my-4 p-4 ${isDarkMode ? 'bg-dark text-white' : ''} ${props?.logs ? '' : 'd-none'}`}>
            <Card.Header className={`text-center h1 py-4`}>
                <div className={'mb-3'}> {props?.title} </div>
                <Button style={{ backgroundColor: generalBlue, width: '200px' }}
                    size={undefined}
                    onClick={() => props?.setShow(!props?.show)}>
                    {props?.show ? "Ocultar" : "Ver"}
                </Button>
            </Card.Header>
            <br />
            <ListGroup variant={'flush'} className={`${props?.show ? '' : 'd-none'}`}>
                {props?.logs && !!props?.logs.length && props?.logs.map((log: typeLog, index: number) =>
                    <div key={index}>
                        <ListGroup.Item className={`${isDarkMode ? 'bg-dark text-white' : ''}`}>
                            {log.logText}
                        </ListGroup.Item>
                    </div>
                )}
            </ListGroup>
        </Card>
    )

    const showedLogs: any[][] = logs ? [
        [logs.campaignAssignmentLogs, showCampaignAssignments, setShowCampaignAssignments, "Asignaciones de la Campaña 2022"],
        [logs.campaignFinishingLogs, showCampaignFinishing, setShowCampaignFinishing, "Completados de la Campaña 2022"],
        [logs.loginLogs, showLogins, setShowLogins, "Ingresos a la App"],
        [logs.userChangesLogs, showUserChanges, setShowUserChanges, "Cambios en los Usuarios"],
        [logs.stateOfTerritoryChangeLogs, showStateChanges, setShowStateChanges, "Cambios en estados de Territorios"],
        [logs.territoryChangeLogs?.slice(0, 100), showPreaching, setShowPreaching, "Predicación"],
        [logs.errorLogs,showErrors, setShowErrors, "Errores de la App"],
    ] : []

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.2rem' : '' }}
        >
            LOGS DE LA APLICACIÓN
        </H2>

        <br /> <br /> <br />

        {!logs && <> <Loading /> </>}

        {logs && showedLogs && !!showedLogs.length && showedLogs.map((log: any[], index: number) =>
            <div key={index}>
                <LogsCard
                    logs={log[0]}
                    show={log[1]}
                    setShow={log[2]}
                    title={log[3]}
                />
            </div>
        )}
    </>
    )
}
