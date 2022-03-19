import { useState, useEffect } from 'react'
// import { Card, Button, Pagination, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap'
// import { ConfirmAlert } from './commons/ConfirmAlert'
import { Loading } from './commons/Loading'
import { H2 } from './css/css'
import { isMobile } from '../services/functions'
import { getAllLogsService } from '../services/logServices'
import { typeLogsObj } from '../models/log'


export const LogsPage = (props: any) => {
    
    const [logs, setLogs] = useState<typeLogsObj>()
    const isDarkMode: string = props.isDarkMode

    
    useEffect(() => {
        getAllLogsService().then((logsObject: typeLogsObj|null) => {
            if (logsObject) setLogs(logsObject)
        })
    }, [])

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.2rem' : '' }}
        >
            LOGS DE LA APLICACIÓN
        </H2>

        {logs && <> <br /> <br /> <br /> <Loading /> </>}

    </>
    )
}
