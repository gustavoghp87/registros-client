import { useEffect, useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Loading } from './commons/Loading'
import { useParams } from 'react-router'
import { Col0b } from './columns/Col0b'
import { ConfirmAlert } from './commons/ConfirmAlert'
import { isMobile, timeConverter } from '../services/functions'
import { H2 } from './css/css'
import { resetTerritoryService } from '../services/territoryServices'
import { getLocalStatisticsService } from '../services/statisticsServices'
import { getStateOfTerritoryService } from '../services/stateTerritoryServices'
import { localStatistic } from '../models/statistic'
import { typeResetDate, typeStateOfTerritory } from '../models/typesTerritorios'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const EstadisticasLocalPage = (props: any) => {

    const { territorio } = useParams<string>()
    const [datos, setDatos] = useState<localStatistic>()
    const [stateOfTerritory, setStateOfTerritory] = useState<typeStateOfTerritory>()
    const [option, setOption] = useState<number>()
    const [message, setMessage] = useState<string>()
    const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
    const isDarkMode: string = props.isDarkMode

    useEffect(() => {
        if (territorio) {
            getLocalStatisticsService(territorio).then((data: localStatistic|null) => { if (data) setDatos(data) })
            getStateOfTerritoryService(territorio).then((stateOfTerritory: typeStateOfTerritory|null) => {
                if (stateOfTerritory !== null) { setStateOfTerritory(stateOfTerritory) }
            })
        }
    }, [territorio])

    const resetHandler = async (option: number): Promise<void> => {
        setOption(option)
        if (option === 1) setMessage("Esta opción resetea los predicados más viejos (más de 6 meses)")
        else if (option === 2) setMessage("Esta opción resetea predicados (no hace nada con los no abonados)")
        else if (option === 3) setMessage("Esta opción resetea todos los predicados y, además, los no abonados de más de 6 meses")
        else if (option === 4) setMessage("Esta opción resetea ABSOLUTAMENTE TODO")
        setTimeout(() => setShowConfirmAlert(true), 1000)
    }

    const setShowConfirmAlertHandler = (): void => setShowConfirmAlert(false)
    
    const resetNow = async (): Promise<void> => {
        setShowConfirmAlertHandler()
        if (!territorio || !option) return
        const success: boolean = await resetTerritoryService(territorio, option)
        if (success) window.location.reload()
    }

    const llamadas: number = datos ? datos.countContesto + datos.countNoContesto + datos.countNoLlamar + datos.countNoAbonado + datos.countDejarCarta : 0

    const llamadasRel: number = datos ? Math.round(llamadas / datos.count * 1000 )/10 : 0

    const predicadas: number = datos ? datos.countContesto + datos.countNoLlamar + datos.countDejarCarta : 0

    // const predicadasRel: number = datos ? Math.round((datos.countContesto + datos.countNoLlamar + datos.countDejarCarta)*10000/datos.count/10)/10 : 0

    // const noContestoRel: number = datos ? Math.round(datos.countNoContesto*10000/datos.count/10)/10 : 0

    // const contestoRel: number = datos ? Math.round(datos.countContesto*10000/datos.count/10)/10 : 0

    // const aDejarCartaRel: number = datos ? Math.round(datos.countDejarCarta*10000/datos.count/10)/10 : 0

    // const noLlamarRel: number = datos ? Math.round(datos.countNoLlamar*10000/datos.count/10)/10 : 0

    return (
        <>
        {showConfirmAlert &&
            <ConfirmAlert
                title={`¿Resetear Territorio ${territorio}?`}
                message={message}
                execution={resetNow}
                cancelAction={setShowConfirmAlertHandler}
            />
        }
        
        <H2 className={isDarkMode ? 'text-white' : ''}> ESTADÍSTICAS </H2>

        <h1 className={isDarkMode ? 'text-white' : ''}
            style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '25px' }}
        >
            TERRITORIO {territorio}
        </h1>

        <Col0b
            territorio={territorio}
            isTodo={false}
            isStatistics={true}
        />

        {datos
        ?
            <div style={{ margin: isMobile ? '0' : '0 10%' }}>

                <br/>
                
                <Card
                    className={isDarkMode ? 'bg-dark text-white' : ''}
                    style={{ padding: '35px', textAlign: isMobile ? 'center' : 'left' }}
                >

                    <h3 className={'text-center mt-3'}>{`Generales`}</h3>

                    <br/>

                    <h4>{`Hay ${datos.count} viviendas: ${datos.count - datos.countNoAbonado} abonadas y ${datos.countNoAbonado} no abonadas`} </h4>

                    <br/>

                    <h4> Libres para llamar: {datos.libres} <span style={{ fontSize: 21 }}>({(1000 - Math.round(llamadasRel*10))/10}%)</span> </h4>

                    <br/>

                    <h4> Llamadas: {llamadas} <span style={{ fontSize: 21 }}>({llamadasRel}%)</span></h4>

                    <br/>

                    <hr />

                    <h3 className={'text-center mt-3'}>{`Composición de Llamadas (${llamadas})`}</h3>

                    <br/>

                    <h4>{`No abonados: ${datos.countNoAbonado} viviendas`} </h4>

                    <br/>

                    <h4>{`No contestó: ${datos.countNoContesto} viviendas`} </h4>
                    
                    <br/>

                    <h4 className={'mb-3'}>{`Predicadas: ${predicadas} viviendas`} </h4>

                    <h4> &nbsp;&nbsp; {`-Contestó: ${datos.countContesto} viviendas`} </h4>

                    <h4> &nbsp;&nbsp; {`-A dejar carta: ${datos.countDejarCarta} viviendas`} </h4>

                    <h4> &nbsp;&nbsp; {`-No llamar: ${datos.countNoLlamar} viviendas`} </h4>

                    {stateOfTerritory && stateOfTerritory.resetDate && !!stateOfTerritory.resetDate.length &&
                        <>
                            <hr />
                            <h3 className={'text-center mt-3'}>{`Reseteos del territorio`}</h3>
                            <br/>
                        </>
                    }
                        
                    {stateOfTerritory && stateOfTerritory.resetDate && !!stateOfTerritory.resetDate.length &&
                        stateOfTerritory.resetDate.map((reset: typeResetDate, index: number) =>
                            <h4 key={index}> &nbsp; {`-El ${timeConverter(reset.date.toString(), true)} con la opción ${reset.option}`} </h4>
                        )
                    }

                    <br/>

                </Card>

                <div style={{ display: 'block', margin: 'auto', marginTop: '50px' }}>
                    <Button variant={'dark'} style={{ display: 'block', margin: 'auto' }}
                        onClick={() => resetHandler(1)}
                    >
                        Limpiar más viejos (más de 6 meses)
                    </Button>
                    <br/>
                    <Button variant={'dark'} style={{ display: 'block', margin: 'auto' }}
                        onClick={() => resetHandler(2)}
                    >
                        Limpiar todos (menos no abonados)
                    </Button>
                    <br/>
                    <Button variant={'dark'} style={{ display: 'block', margin: 'auto' }}
                        onClick={() => resetHandler(3)}
                    >
                        Limpiar todos y no abonados de más de 6 meses
                    </Button>
                    <br/>
                    <Button variant={'dark'} style={{ display: 'block', margin: 'auto' }}
                        onClick={() => resetHandler(4)}
                    >
                        Limpiar absolutamente todos
                    </Button>
                    <br/>
                </div>

            </div>
        :
            <>
                <br/>
                <br/>
                <br/>
                <Loading />
            </>
        }

    </>
    )
}
