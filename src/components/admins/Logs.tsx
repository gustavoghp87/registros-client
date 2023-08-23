import { getAllLogsService } from '../../services'
import { H2, Loading } from '../commons'
import { LogsCard } from '.'
import { typeAllLogsObj, typeLogObj, typeLogsAndTitle } from '../../models'
import { useState, useEffect } from 'react'

export const Logs = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [logs, setLogs] = useState<typeLogsAndTitle[]>()

    const sortAndSliceLogsArray = (logs: typeLogObj[]): typeLogObj[] => logs?.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100)

    const removeDuplicates = (logs: typeLogObj[]): typeLogObj[] => logs   // TODO

    useEffect(() => {
        getAllLogsService().then((allLogsObj0: typeAllLogsObj|null) => {
            setIsLoading(false)
            if (!allLogsObj0) return
            setLogs([
                //{ logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.campaignLogs?.logs)), title: "Campaña 2022" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.errorLogs?.logs)), title: "Errores generales de la App" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.loginLogs?.logs)), title: "Ingresos a la App" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.userLogs?.logs)), title: "Cambios en los Usuarios" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.telephonicStateLogs?.logs)), title: "Cambios en estados de Territorios de la Telefónica" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.telephonicLogs?.logs)), title: "Llamados de Telefónica" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.houseToHouseAdminLogs?.logs)), title: "Casa en casa - Admins" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.houseToHouseLogs?.logs)), title: "Casa en casa" },
                { logs: removeDuplicates(sortAndSliceLogsArray(allLogsObj0.configLogs?.logs)), title: "Cambios en la configuración" },
            ])
        })
        return () => setLogs(undefined)
    }, [])

    return (
        <>
            <H2 title={"LOGS DE LA APLICACIÓN"} />

            {isLoading ?
                <Loading mt={'50px'} />
                :
                <>
                {!!logs?.length && logs.some(x => !!x.logs?.length) ?
                    logs.map((log: typeLogsAndTitle) =>
                        <LogsCard
                            key={log.title}
                            log={log}
                        />
                    )
                    :
                    <h4 className='text-center mt-5'>No hay datos</h4>
                }
                </>
            }

        </>
    )
}
