import { useState, useEffect } from 'react'
import { H2, Loading } from '../commons'
import { getAllLogsService } from '../../services'
import { typeAllLogsObj, typeLogsAndTitle } from '../../models'
import { LogCard } from '.'

export const Logs = () => {

    const [logs, setLogs] = useState<typeLogsAndTitle[]>()

    useEffect(() => {
        getAllLogsService().then((allLogsObj0: typeAllLogsObj|null) => {
            if (!allLogsObj0) return
            setLogs([
                { logs: allLogsObj0.campaignLogs.logs.reverse().slice(0, 100), title: "Campaña 2022" },
                { logs: allLogsObj0.errorLogs.logs.slice(0, 100), title: "Errores generales de la App" },
                { logs: allLogsObj0.loginLogs.logs.slice(0, 100), title: "Ingresos a la App" },
                { logs: allLogsObj0.userLogs.logs.slice(0, 100), title: "Cambios en los Usuarios" },
                { logs: allLogsObj0.telephonicStateLogs.logs.slice(0, 100), title: "Cambios en estados de Territorios de la Telefónica" },
                { logs: allLogsObj0.telephonicLogs.logs.slice(0, 100), title: "Llamados de Telefónica" },
                { logs: allLogsObj0.houseToHouseAdminLogs.logs.slice(0, 100), title: "Casa en casa - Admins" },
                { logs: allLogsObj0.houseToHouseLogs.logs.slice(0, 100), title: "Casa en casa" },
            ])
        })
        return () => setLogs(undefined)
    }, [])

    return (
        <>
            <H2 title={"LOGS DE LA APLICACIÓN"} />

            {!!logs?.length ?
                logs.map((log: typeLogsAndTitle) =>
                    <LogCard
                        key={log.title}
                        log={log}
                    />
                )
                :
                <Loading mt={'50px'} />
            }
        </>
    )
}
