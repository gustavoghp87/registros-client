import { Card, ListGroup } from 'react-bootstrap'
import { FC, useState } from 'react'
import { typeLogObj, typeLogsAndTitle, typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    log: typeLogsAndTitle
}

export const LogsCard: FC<propsType> = ({ log }) => {
    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode
    }))
    const [showLogs, setShowLogs] = useState(false)

    return (
        <Card
            className={`mb-4 p-4 ${isDarkMode ? 'bg-dark text-white' : ''}`}
            style={{ marginTop: '70px' }}
        >
            <Card.Header className={'text-center h1 py-4'}>
                <div className={'mb-3'}> {log.title} </div>
                <button className={'btn btn-general-blue'}
                    onClick={() => !!log?.logs?.length ? setShowLogs(x => !x) : null}
                    style={{ width: '200px' }}
                    disabled={!log?.logs?.length}
                >
                    {!!log?.logs?.length ? showLogs ? "Ocultar" : "Ver" : "No hay"}
                </button>
            </Card.Header>
            <br />
            {showLogs &&
                <ListGroup variant={'flush'}>
                    {log.logs.map((log: typeLogObj, index: number) =>
                        <ListGroup.Item className={isDarkMode ? 'bg-dark text-white' : ''} key={index}>
                            {log.logText}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            }
        </Card>
    )
}
