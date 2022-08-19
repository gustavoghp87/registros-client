import { useState, useEffect } from 'react'
import { H2, Loading } from '../commons'
import { getAllLogsService } from '../../services'
import { typeAllLogsObj, typeLogObj, typeLogsAndTitle } from '../../models'
import { LogCard } from '.'

export const Logs = () => {

    const [logs, setLogs] = useState<typeLogsAndTitle[]>()

    const sortAndSliceLogsArray = (logs: typeLogObj[]): typeLogObj[] => logs?.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100)

    useEffect(() => {
        getAllLogsService().then((allLogsObj0: typeAllLogsObj|null) => {
            if (!allLogsObj0) return
            setLogs([
                { logs: sortAndSliceLogsArray(allLogsObj0.campaignLogs.logs), title: "Campaña 2022" },
                { logs: sortAndSliceLogsArray(allLogsObj0.errorLogs.logs), title: "Errores generales de la App" },
                { logs: sortAndSliceLogsArray(allLogsObj0.loginLogs.logs), title: "Ingresos a la App" },
                { logs: sortAndSliceLogsArray(allLogsObj0.userLogs.logs), title: "Cambios en los Usuarios" },
                { logs: sortAndSliceLogsArray(allLogsObj0.telephonicStateLogs.logs), title: "Cambios en estados de Territorios de la Telefónica" },
                { logs: sortAndSliceLogsArray(allLogsObj0.telephonicLogs.logs), title: "Llamados de Telefónica" },
                { logs: sortAndSliceLogsArray(allLogsObj0.houseToHouseAdminLogs.logs), title: "Casa en casa - Admins" },
                { logs: sortAndSliceLogsArray(allLogsObj0.houseToHouseLogs.logs), title: "Casa en casa" }
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
