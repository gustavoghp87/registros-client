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

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.2rem' : '' }}
        >
            LOGS DE LA APLICACIÓN
        </H2>

        <br /> <br /> <br />

        {!logs && <> <Loading /> </>}

        {logs &&
        <>
            <LogsCard
                logs={logs.campaignAssignmentLogs}
                show={showCampaignAssignments}
                setShow={setShowCampaignAssignments}
                title={"Asignaciones de la Campaña 2022"}
            />

            <LogsCard
                logs={logs.campaignFinishingLogs}
                show={showCampaignFinishing}
                setShow={setShowCampaignFinishing}
                title={"Completados de la Campaña 2022"}
            />

            <LogsCard
                logs={logs.loginLogs}
                show={showLogins}
                setShow={setShowLogins}
                title={"Ingresos a la App"}
            />

            <LogsCard
                logs={logs.userChangesLogs}
                show={showUserChanges}
                setShow={setShowUserChanges}
                title={"Cambios en los Usuarios"}
            />

            <LogsCard
                logs={logs.stateOfTerritoryChangeLogs}
                show={showStateChanges}
                setShow={setShowStateChanges}
                title={"Cambios en estados de Territorios"}
            />

            <LogsCard
                logs={logs.territoryChangeLogs?.slice(0, 100)}
                show={showPreaching}
                setShow={setShowPreaching}
                title={"Predicación"}
            />

            <LogsCard
                logs={logs.errorLogs}
                show={showErrors}
                setShow={setShowErrors}
                title={"Errores de la App"}
            />
        </>
        }
    </>
    )
}
