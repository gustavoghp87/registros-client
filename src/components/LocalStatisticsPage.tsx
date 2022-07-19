import { useEffect, useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Loading } from './commons/Loading'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Col0b } from './telephonic-components/Col0b'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import { getLocalStatisticsService, getStateOfTerritoryService, resetTerritoryService, timeConverter } from '../services'
import { typeAppDispatch, typeLocalStatistic, typeResetDate, typeRootState, typeStateOfTerritory } from '../models'
import { H2 } from './css/css'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const LocalStatisticsPage = () => {

    const { territorio } = useParams<string>()
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [datos, setDatos] = useState<typeLocalStatistic>()
    const [stateOfTerritory, setStateOfTerritory] = useState<typeStateOfTerritory>()

    useEffect(() => {
        if (territorio) {
            getLocalStatisticsService(territorio).then((data: typeLocalStatistic|null) => { if (data) setDatos(data) })
            getStateOfTerritoryService(territorio).then((stateOfTerritory: typeStateOfTerritory|null) => {
                if (stateOfTerritory !== null) { setStateOfTerritory(stateOfTerritory) }
            })
        }
    }, [territorio])
    
    type typeOption = 1 | 2 | 3 | 4
    let option: typeOption = 1
    
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    
    const resetHandler = async (selectedOption: typeOption): Promise<void> => {
        if (!selectedOption) return
        option = selectedOption
        let message: string = ""
        if (option === 1)
            message = "Esta opción resetea los predicados más viejos (más de 6 meses)"
        else if (option === 2)
            message = "Esta opción resetea predicados (no hace nada con los no abonados)"
        else if (option === 3)
            message = "Esta opción resetea todos los predicados y, además, los no abonados de más de 6 meses"
        else if (option === 4)
            message = "Esta opción resetea ABSOLUTAMENTE TODO"
        else return
        dispatch(setValuesAndOpenAlertModalReducer({
            showingAlertModal: true,
            mode: 'confirm',
            title: `¿Resetear Territorio ${territorio}?`,
            message,
            execution: resetNow
        }))
    }
    
    const resetNow = async (): Promise<void> => {
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
                            <h4 key={index}>
                                &nbsp; {`-El ${timeConverter(reset.date.toString(), true)} con la opción ${reset.option}`}
                            </h4>
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
