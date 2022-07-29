import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Button, ListGroup } from 'react-bootstrap'
import { H2, Loading } from '../commons'
import { generalBlue } from '../../config'
import { getAllLogsService } from '../../services'
import { typeLog, typeLogsObj, typeRootState } from '../../models'

type typeDoubleArray = [typeLog[], boolean, React.Dispatch<React.SetStateAction<boolean>>, string] | []

export const LogsPage = () => {
    
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
        if (!logsPackage) getAllLogsService().then((logsObject: typeLogsObj|null) => {
            if (logsObject) setLogsPackage(logsObject)
        })
    }, [logsPackage])

    return (
    <>
        <H2 title={"LOGS DE LA APLICACIÓN"} />

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
