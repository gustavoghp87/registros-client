import { useState, useEffect } from 'react'
import { Card, Button, ListGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { useAuth } from '../context/authContext'
import { Loading } from './commons/Loading'
import { generalBlue } from '../config'
import { H2 } from './css/css'
import { getAllLogsService } from '../services/logServices'
import { typeLog, typeLogsObj } from '../models/log'
import { typeUser } from '../models/user'

export const LogsPage = () => {
    
    const user: typeUser|undefined = useAuth().user
    const [logsPackage, setLogsPackage] = useState<typeLogsObj>()
    const [showCampaignAssignments, setShowCampaignAssignments] = useState<boolean>(false)
    const [showCampaignFinishing, setShowCampaignFinishing] = useState<boolean>(false)
    const [showLogins, setShowLogins] = useState<boolean>(false)
    const [showUserChanges, setShowUserChanges] = useState<boolean>(false)
    const [showStateChanges, setShowStateChanges] = useState<boolean>(false)
    const [showPreaching, setShowPreaching] = useState<boolean>(false)
    const [showEmailErrors, setShowEmailErrors] = useState<boolean>(false)
    const [showErrors, setShowErrors] = useState<boolean>(false)
    //const [showAppChanges, setShowAppChanges] = useState<boolean>(false)
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    useEffect(() => {
        //if (user && !user.isAuth) { window.location.href = "/"; return }
        if (!logsPackage) getAllLogsService().then((logsObject: typeLogsObj|null) => {
            if (logsObject) setLogsPackage(logsObject)
        })
    }, [user, logsPackage])

    const setShowCampaignAssignmentsHandler = (): void => setShowCampaignAssignments(!showCampaignAssignments)
    const setShowCampaignFinishingHandler = (): void => setShowCampaignFinishing(!showCampaignFinishing)
    const setShowLoginsHandler = (): void => setShowLogins(!showLogins)
    const setShowUserChangesHandler = (): void => setShowUserChanges(!showUserChanges)
    const setShowStateChangesHandler = (): void => setShowStateChanges(!showStateChanges)
    const setShowPreachingHandler = (): void => setShowPreaching(!showPreaching)
    const setShowEmailErrorsHandler = (): void => setShowEmailErrors(!showEmailErrors)
    const setShowErrorsHandler = (): void => setShowErrors(!showErrors)

    type typeDoubleArray = [typeLog[], boolean, React.Dispatch<React.SetStateAction<boolean>>, string] | []

    const showedLogs: typeDoubleArray[]|[] = logsPackage ? [
        [logsPackage.campaignAssignmentLogs, showCampaignAssignments, setShowCampaignAssignmentsHandler, "Asignaciones de la Campaña 2022"],
        [logsPackage.campaignFinishingLogs, showCampaignFinishing, setShowCampaignFinishingHandler, "Completados de la Campaña 2022"],
        [logsPackage.loginLogs, showLogins, setShowLoginsHandler, "Ingresos a la App"],
        [logsPackage.userChangesLogs, showUserChanges, setShowUserChangesHandler, "Cambios en los Usuarios"],
        [logsPackage.stateOfTerritoryChangeLogs, showStateChanges, setShowStateChangesHandler, "Cambios en estados de Territorios"],
        user && user.email === "ghp.2120@gmail.com" ? [logsPackage.territoryChangeLogs?.slice(0, 100), showPreaching, setShowPreachingHandler, "Predicación"] : [],
        [logsPackage.emailErrorLogs, showEmailErrors, setShowEmailErrorsHandler, "Errores de email"],
        [logsPackage.errorLogs, showErrors, setShowErrorsHandler, "Errores generales de la App"]
        // [logs.appLogs.filter((log: typeLog) => !log.logText.includes("DB")), showAppChanges, setShowAppChangesHandler, "Reinicios de la App"]
    ] : []

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.2rem' : '' }}
        >
            LOGS DE LA APLICACIÓN
        </H2>

        <br /> <br /> <br />

        {!logsPackage && <> <Loading /> </>}

        {logsPackage && showedLogs.map((log: typeDoubleArray, index: number) => {
            if (!log) return (<></>)
            const logs: typeLog[] = log[0] ? log[0] : []
            const show: boolean = log[1] ? true : false
            const setShow: Function = log[2] ? log[2] : () => { }
            const title: string = log[3] ? log[3] : ""

            return (
                <Card key={index} className={`my-4 p-4 ${isDarkMode ? 'bg-dark text-white' : ''} ${logs ? '' : 'd-none'}`}>
                    <Card.Header className={'text-center h1 py-4'}>
                        <div className={'mb-3'}> {title} </div>
                        <Button style={{ backgroundColor: generalBlue, width: '200px' }}
                            size={undefined}
                            onClick={() => setShow()}
                        >
                            {show ? "Ocultar" : "Ver"}
                        </Button>
                    </Card.Header>
                    <br />
                    <ListGroup variant={'flush'} className={show ? '' : 'd-none'}>
                        {logs && !!logs.length && logs.map((log: typeLog, index: number) =>
                            <div key={index}>
                                <ListGroup.Item className={isDarkMode ? 'bg-dark text-white' : ''}>
                                    {log.logText}
                                </ListGroup.Item>
                            </div>
                        )}
                    </ListGroup>
                </Card>
            )
        })}
    </>
    )
}
