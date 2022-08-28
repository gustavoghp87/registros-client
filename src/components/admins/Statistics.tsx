import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { H2, Hr, Loading } from '../commons'
import { getLocalStatisticsService, getGlobalStatisticsService } from '../../services'
import { generalBlue, typeLocalTelephonicStatistic, typeRootState, typeTelephonicStatistic } from '../../models'

export const Statistics = () => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [globalS, setGlobalStatistics] = useState<typeTelephonicStatistic>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [localS, setLocalStatistics] = useState<typeLocalTelephonicStatistic[]>([])
    const [showBtn, setShowBtn] = useState<boolean>(true)
    
    const retrieveLocalStats = async (): Promise<void> => {
        setIsLoading(true)
        setShowBtn(false)
        const allLocalStatistics: typeLocalTelephonicStatistic[]|null = await getLocalStatisticsService()
        setIsLoading(false)
        if (!allLocalStatistics) return
        setLocalStatistics(allLocalStatistics)
    }

    useEffect(() => {
        getGlobalStatisticsService().then((data: typeTelephonicStatistic|null) => {
            setIsLoading(false)
            if (!data) return
            data.numberOf_ADejarCarta_relative = Math.round((data.numberOf_ADejarCarta * 100)/data.numberOfHouseholds)
            data.numberOf_FreePhones = data.numberOfHouseholds - data.numberOf_ADejarCarta - data.numberOf_Contesto - data.numberOf_NoAbonado - data.numberOf_NoContesto - data.numberOf_NoLlamar
            data.numberOf_NoContesto_relative = Math.round((data.numberOf_Contesto * 100)/data.numberOfHouseholds)
            data.numberOf_NoLlamar_relative = Math.round((data.numberOf_NoLlamar * 100)/data.numberOfHouseholds)
            data.numberOfAlreadyCalled = data.numberOf_Contesto + data.numberOf_NoContesto + data.numberOf_NoLlamar + data.numberOf_NoAbonado
            data.numberOfAlreadyCalledRelative = Math.round((data.numberOfAlreadyCalled * 100)/data.numberOfHouseholds)
            data.numberOfAlreadyDone = data.numberOf_Contesto + data.numberOf_NoLlamar + data.numberOf_ADejarCarta
            data.numberOfAlreadyDoneRelative = Math.round((data.numberOfAlreadyCalled * 100)/data.numberOfHouseholds)
            setGlobalStatistics(data)
        })
        return () => setGlobalStatistics(undefined)
    }, [])

    return (
    <>
        <H2 title={"ESTADÍSTICAS DE LA TELEFÓNICA"} />

        {globalS ?
            <div style={{ margin: isMobile ? '0' : '0 10%' }}>
                <br/>
                <br/>
                <div
                    className={`card ${isDarkMode ? 'bg-dark text-white' : ''}`}
                    style={{ padding: '35px', textAlign: isMobile ? 'center' : undefined }}
                >

                    <h4> Hay {globalS.numberOfHouseholds} viviendas, {globalS.numberOf_NoAbonado} no abonadas. Neto: {globalS.numberOfHouseholds - globalS.numberOf_NoAbonado} </h4>

                    <br/>

                    <h4> Llamadas: {globalS.numberOfAlreadyCalled} ({globalS.numberOfAlreadyCalledRelative}%) (Predicadas (sin cartas) + No contestó + No abonadas) </h4>

                    <br/>

                    <h4> Libres para llamar: {globalS.numberOf_FreePhones} </h4>

                    <Hr />

                    <h4> Predicadas: {globalS.numberOfAlreadyDone} viviendas ({globalS.numberOfAlreadyDoneRelative}%) </h4>

                    <br/>

                    <h4> &nbsp;&nbsp; Contestó: {globalS.numberOf_Contesto} viviendas ({globalS.numberOf_NoContesto_relative}%) </h4>

                    <h4> &nbsp;&nbsp; A dejar carta: {globalS.numberOf_ADejarCarta} viviendas ({globalS.numberOf_ADejarCarta_relative}%) </h4>

                    <h4> &nbsp;&nbsp; No llamar: {globalS.numberOf_NoLlamar} viviendas ({globalS.numberOf_NoLlamar_relative}%) </h4>

                    <br/>

                    <h4> No contestó: {globalS.numberOf_NoContesto} viviendas ({globalS.numberOf_NoContesto_relative}%) </h4>

                </div>

            </div>
        :
            <Loading mt={'50px'} />
        }

        <br/>
        <br/>

        
        {showBtn && globalS &&
            <button
                className={'btn btn-general-blue d-block mx-auto'}
                onClick={() => retrieveLocalStats()}
                style={{
                    backgroundColor: generalBlue,
                    border: '1px solid ' + generalBlue,
                    borderRadius: '5px'
                }}
            >
                Traer Estadísticas por Territorio
            </button>
        }


        {localS && !!localS.length && localS.map((territory: typeLocalTelephonicStatistic) =>
            <Link key={territory.territoryNumber} to={`/telefonica/${territory.territoryNumber}`}>
                <div
                    className={`card d-block mx-auto mt-3 ${territory.numberOf_FreePhones < 50 ? 'bg-danger' : (territory.numberOf_FreePhones < 100 ? 'bg-warning': 'bg-success')} ${territory.isFinished ? 'animate__animated animate__flash animate__infinite animate__slower' : ''}`}
                    style = {{
                        color: 'black',
                        marginBottom: '20px',
                        maxWidth: isMobile ? '80%' : '55%',
                        padding: '35px',
                        textAlign: isMobile ? 'center' : undefined
                    }}
                >
                    <h3> Territorio {territory.territoryNumber} {territory.isFinished ? '- TERMINADO' : ''} </h3>
                    <h4> Quedan {territory.numberOf_FreePhones} para predicar </h4>
                </div>
            </Link>
        )}

        {isLoading && <Loading mt={'40px'} mb={'20px'} />}

    </>
    )
}
