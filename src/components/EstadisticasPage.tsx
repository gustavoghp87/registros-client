import { useEffect, useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Loading } from './commons/Loading'
import { generalBlue } from '../config'
import { getAllLocalStatisticsService, getGlobalStatisticsService, getStateOfTerritoriesService } from '../services'
import { typeLocalStatistic, typeRootState, typeStateOfTerritory, typeStatistic } from '../models'
import { H2 } from './css/css'

export const EstadisticasPage = () => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [globalStatistics, setGlobalStatistics] = useState<typeStatistic|null>()
    const [localStatisticsArray, setLocalStatisticsArray] = useState<typeLocalStatistic[]|null>()
    const [loading, setLoading] = useState<boolean>(false)
    const [showBtn, setShowBtn] = useState<boolean>(true)
    const [states, setStates] = useState<typeStateOfTerritory[]>()

    useEffect(() => {
        getGlobalStatisticsService().then((data: typeStatistic|null) => {
            if (data) setGlobalStatistics(data)
        })
    }, [])

    const retrieveLocalStats = async () => {
        setLoading(true);
        setShowBtn(false);
        const allLocalStatistics: typeLocalStatistic[]|null = await getAllLocalStatisticsService()
        if (allLocalStatistics) {
            setLocalStatisticsArray(allLocalStatistics)
            setLoading(false)
            const states1: typeStateOfTerritory[]|null = await getStateOfTerritoriesService()
            if (states1) setStates(states1)
        }
    }

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}> ESTADÍSTICAS GLOBALES </H2>

        {globalStatistics ?
            <div style={{ margin: isMobile ? '0' : '0 10%' }}>
                <br/>
                <br/>
                <Card
                    className={isDarkMode ? 'bg-dark text-white' : ''}
                    style={{ padding: '35px', textAlign: isMobile ? 'center' : 'left' }}
                >

                    <h4>{`Hay ${globalStatistics.count} viviendas, ${globalStatistics.countNoAbonado} no abonadas. Neto: ${globalStatistics.count - globalStatistics.countNoAbonado}`} </h4>

                    <br/>

                    <h4>Llamadas: {globalStatistics.countContesto + globalStatistics.countNoContesto + globalStatistics.countNoLlamar + globalStatistics.countNoAbonado} ({ Math.round( (globalStatistics.countContesto + globalStatistics.countNoContesto + globalStatistics.countNoLlamar + globalStatistics.countNoAbonado) / globalStatistics.count * 1000 )/10}%) (Predicadas (sin cartas) + No contestó + No abonadas) </h4>

                    <br/>

                    <h4>Libres para llamar: {globalStatistics.libres} </h4>

                    <hr/>

                    <h4>{`Predicadas: ${globalStatistics.countContesto + globalStatistics.countNoLlamar + globalStatistics.countDejarCarta} viviendas (${Math.round((globalStatistics.countContesto + globalStatistics.countNoLlamar + globalStatistics.countDejarCarta)*10000/globalStatistics.count)/100}%)`} </h4>

                    <br/>

                    <h4> &nbsp;&nbsp; {`Contestó: ${globalStatistics.countContesto} viviendas (${Math.round(globalStatistics.countContesto*10000/globalStatistics.count)/100}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`A dejar carta: ${globalStatistics.countDejarCarta} viviendas (${Math.round(globalStatistics.countDejarCarta*10000/globalStatistics.count)/100}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`No llamar: ${globalStatistics.countNoLlamar} viviendas (${Math.round(globalStatistics.countNoLlamar*10000/globalStatistics.count)/100}%)`} </h4>

                    <br/>

                    <h4>{`No contestó: ${globalStatistics.countNoContesto} viviendas (${Math.round(globalStatistics.countNoContesto*10000/globalStatistics.count)/100}%)`} </h4>

                </Card>

            </div>
        :
            <>
                <br/>
                <br/>
                <br/>
                <Loading />
            </>
        }

        <br/>
        <br/>

        
        {showBtn &&
            <Button
                className={'d-block mx-auto'}
                style={{
                    backgroundColor: generalBlue,
                    border: '1px solid ' + generalBlue,
                    borderRadius: '5px'
                }}
                onClick={() => retrieveLocalStats()}
            >
                Traer Estadísticas por Territorio
            </Button>
        }

        {localStatisticsArray && !!localStatisticsArray.length &&
            localStatisticsArray.map((territory: typeLocalStatistic, index: number) => {
                let isFinished = false
                if (states) states.forEach((state: typeStateOfTerritory) => {
                    if (state && territory && state.territorio === territory.territorio) isFinished = state.isFinished
                })
                return (
                    <a key={index} href={`/estadisticas/${territory.territorio}`}>
                        <Card
                            style = {{
                                padding: '35px', textAlign: isMobile ? 'center' : 'left',
                                display: 'block', margin: 'auto', color: 'black',
                                maxWidth: isMobile ? '80%' : '55%', marginBottom: '20px',
                                backgroundColor: territory.libres < 50 ? 'red' : (territory.libres < 100 ? 'yellow': 'green')
                            }}
                            className={isFinished ? 'animate-me' : ''}
                        >
                            <h3> Territorio {territory.territorio} {isFinished ? '- TERMINADO' : ''} </h3>
                            <h4> Quedan {territory.libres} para predicar </h4>
                        </Card>
                    </a>
                )
            })
        }
        
        {loading ?
            <>
                <br/>
                <br/>
                <br/>
                <Loading />
                <br/>
                <h4 style={{ textAlign: 'center' }}> Esto demora 10 segundos </h4>
            </>
            :
            <></>
        }

    </>
    )
}
