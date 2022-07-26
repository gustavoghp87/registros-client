import { useEffect, useState } from 'react'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Card, Button } from 'react-bootstrap'
import { generalBlue } from '../../config'
import { H2, Loading } from '../commons'
import { getAllLocalStatisticsService, getGlobalStatisticsService, getStateOfTerritoriesService } from '../../services'
import { typeLocalStatistic, typeRootState, typeStateOfTerritory, typeStatistic } from '../../models'

export const StatisticsPage = () => {

    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const navigate: NavigateFunction = useNavigate()
    const [globalStatistics, setGlobalStatistics] = useState<typeStatistic|null>()
    const [loading, setLoading] = useState<boolean>(false)
    const [localStatisticsArray, setLocalStatisticsArray] = useState<typeLocalStatistic[]|null>()
    const [showBtn, setShowBtn] = useState<boolean>(true)
    const [states, setStates] = useState<typeStateOfTerritory[]>()
    
    const retrieveLocalStats = async (): Promise<void> => {
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

    useEffect(() => {
        getGlobalStatisticsService().then((data: typeStatistic|null) => {
            if (data) setGlobalStatistics(data)
        })
        return () => {
            setLocalStatisticsArray(undefined)
            setStates(undefined)
        }
    }, [])

    useEffect(() => { if (!user || !user.isAdmin) navigate('/acceso')}, [navigate, user])

    return (
    <>
        <H2 title={"ESTADÍSTICAS GLOBALES"} />

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
            <Loading mt={15} mb={2} />
        }

        <br/>
        <br/>

        
        {showBtn && globalStatistics &&
            <Button
                className={'d-block mx-auto'}
                onClick={() => retrieveLocalStats()}
                style={{
                    backgroundColor: generalBlue,
                    border: '1px solid ' + generalBlue,
                    borderRadius: '5px'
                }}
            >
                Traer Estadísticas por Territorio
            </Button>
        }


        {localStatisticsArray && !!localStatisticsArray.length && localStatisticsArray.map((territory: typeLocalStatistic) => {
                
            let isFinished = false
            if (states) states.forEach((state: typeStateOfTerritory) => {
                if (state && territory && state.territorio === territory.territorio) isFinished = state.isFinished
            })

            return (
                <Link key={territory.territorio} to={`/territorios/${territory.territorio}`}>
                    <Card
                        className={`d-block mx-auto mt-3 ${territory.libres < 50 ? 'bg-danger' : (territory.libres < 100 ? 'bg-warning': 'bg-success')} ${isFinished ? 'animate__animated animate__flash animate__infinite animate__slower' : ''}`}
                        style = {{
                            color: 'black',
                            marginBottom: '20px',
                            maxWidth: isMobile ? '80%' : '55%',
                            padding: '35px', textAlign: isMobile ? 'center' : 'left'
                        }}
                    >
                        <h3> Territorio {territory.territorio} {isFinished ? '- TERMINADO' : ''} </h3>
                        <h4> Quedan {territory.libres} para predicar </h4>
                    </Card>
                </Link>
            )
        })}
        
        
        {loading &&
            <>
                <Loading mt={8} mb={4} />

                <h4 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                    Esto demora 10 segundos
                </h4>
            </>
        }
    </>
    )
}
