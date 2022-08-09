import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, ListGroup } from 'react-bootstrap'
import { H2, Loading } from '../commons'
import { getAllLogsService } from '../../services'
import { typeLog, typeLogsObj, typeRootState } from '../../models'

type typeDoubleArray = [typeLog[], boolean, React.Dispatch<React.SetStateAction<boolean>>, string] | []

export const Logs = () => {
    
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [logsPackage, setLogsPackage] = useState<typeLogsObj>()
    const [showCampaignAssignments, setShowCampaignAssignments] = useState<boolean>(false)
    const [showCampaignFinishing, setShowCampaignFinishing] = useState<boolean>(false)
    const [showLogins, setShowLogins] = useState<boolean>(false)
    const [showUserChanges, setShowUserChanges] = useState<boolean>(false)
    const [showStateChanges, setShowStateChanges] = useState<boolean>(false)
    const [showPreaching, setShowPreaching] = useState<boolean>(false)
    const [showEmailErrors, setShowEmailErrors] = useState<boolean>(false)
    const [showErrors, setShowErrors] = useState<boolean>(false)

    const setShowCampaignAssignmentsHandler = (): void => setShowCampaignAssignments(!showCampaignAssignments)
    
    const setShowCampaignFinishingHandler = (): void => setShowCampaignFinishing(!showCampaignFinishing)
    
    const setShowLoginsHandler = (): void => setShowLogins(!showLogins)
    
    const setShowUserChangesHandler = (): void => setShowUserChanges(!showUserChanges)
    
    const setShowStateChangesHandler = (): void => setShowStateChanges(!showStateChanges)
    
    const setShowPreachingHandler = (): void => setShowPreaching(!showPreaching)
    
    const setShowEmailErrorsHandler = (): void => setShowEmailErrors(!showEmailErrors)
    
    const setShowErrorsHandler = (): void => setShowErrors(!showErrors)

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

    useEffect(() => {
        getAllLogsService().then((logsObject: typeLogsObj|null) => {
            if (logsObject) setLogsPackage(logsObject)
        })
        return () => setLogsPackage(undefined)
    }, [])

    return (
    <>
        <H2 title={"LOGS DE LA APLICACIÓN"} />

        {!logsPackage && <Loading mt={'50px'} />}

        {logsPackage && showedLogs.map((log: typeDoubleArray, index: number) => {
            if (!log) return (<></>)
            const logs: typeLog[] = log[0] ? log[0] : []
            const show: boolean = log[1] ? true : false
            const setShow: Function = log[2] ? log[2] : () => { }
            const title: string = log[3] ? log[3] : ""

            return (
                <Card key={index}
                    className={`mb-4 p-4 ${isDarkMode ? 'bg-dark text-white' : ''} ${logs ? '' : 'd-none'}`}
                    style={{ marginTop: '70px' }}
                >
                    <Card.Header className={'text-center h1 py-4'}>
                        <div className={'mb-3'}> {title} </div>
                        <button className={'btn btn-general-blue'}
                            onClick={() => setShow()}
                            style={{ width: '200px' }}
                        >
                            {show ? "Ocultar" : "Ver"}
                        </button>
                    </Card.Header>
                    <br />
                    {show &&
                        <ListGroup variant={'flush'}>
                            {logs && !!logs.length && logs.map((log: typeLog, index: number) =>
                                <ListGroup.Item className={isDarkMode ? 'bg-dark text-white' : ''} key={index}>
                                    {log.logText}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    }
                </Card>
            )
        })}
    </>
    )
}
