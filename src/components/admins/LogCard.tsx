import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, ListGroup } from 'react-bootstrap'
import { typeLogObj, typeLogsAndTitle, typeRootState } from '../../models'

export const LogCard = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode
    }))
    const log: typeLogsAndTitle = props.log
    const [showLogs, setShowLogs] = useState<boolean>(false)

    if (!log || !log.logs?.length) return (<></>)

    return (
        <Card
            className={`mb-4 p-4 ${isDarkMode ? 'bg-dark text-white' : ''}`}
            style={{ marginTop: '70px' }}
        >
            <Card.Header className={'text-center h1 py-4'}>
                <div className={'mb-3'}> {log.title} </div>
                <button className={'btn btn-general-blue'}
                    onClick={() => setShowLogs(x => !x)}
                    style={{ width: '200px' }}
                >
                    {showLogs ? "Ocultar" : "Ver"}
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
