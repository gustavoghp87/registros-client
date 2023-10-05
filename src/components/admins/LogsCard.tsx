import { Card, ListGroup } from 'react-bootstrap'
import { FC, useState } from 'react'
import { hthConfigOptions } from '../../app-config'
import { maskTheBlock, maskTheFace } from '../../services'
import { typeLogsAndTitle, typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    log: typeLogsAndTitle
}

// enmascarar manzanas y caras

export const LogsCard: FC<propsType> = ({ log }) => {
    const { config, isDarkMode } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode
    }))
    const [showLogs, setShowLogs] = useState(false)

    const maskBlockAndFaceHandler = (log: string) => {
        console.log(log);
        // const maskedLog = log
        hthConfigOptions.blocks.forEach(b => {
            log = log.replace(`manzana ${b}`, `manzana ${maskTheBlock(b, config.usingLettersForBlocks)}`)
            log = log.replace(`Manzana ${b}`, `Manzana ${maskTheBlock(b, config.usingLettersForBlocks)}`)
        })
        hthConfigOptions.faces.forEach(f => {
            log = log.replace(`cara ${f}`, `cara ${maskTheFace(f, config.usingLettersForBlocks)}`)
            log = log.replace(`Cara ${f}`, `Cara ${maskTheFace(f, config.usingLettersForBlocks)}`)
        })
        return log
    }

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
                    {log.logs.map(log =>
                        <ListGroup.Item className={isDarkMode ? 'bg-dark text-white' : ''} key={log.timestamp}>
                            {maskBlockAndFaceHandler(log.logText)}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            }
        </Card>
    )
}
