import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { H2, Loading } from '../commons'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'
import { resetTerritoryService, timeConverter } from '../../services'
import { aDejarCarta, contesto, noContesto, noLlamar, noPredicado, typeAppDispatch, typeHousehold, typeLocalStatistic, typeResetDate, typeRootState, typeStateOfTerritory, typeTerritoryNumber } from '../../models'

type typeProcessedData = {
    llamadas: number
    llamadasRel: number
    predicadas: number
}

type typeOption = 1 | 2 | 3 | 4

export const LocalStatistics = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const households: typeHousehold[] = props.households
    const territory: typeTerritoryNumber = props.territory
    const stateOfTerritory: typeStateOfTerritory = props.stateOfTerritory
    const [localStatistics, setLocalStatistics] = useState<typeLocalStatistic>()
    const [processedData, setProcessedData] = useState<typeProcessedData>()
    let option: typeOption = 1

    const resetHandler = async (selectedOption: typeOption): Promise<void> => {
        if (!selectedOption) return
        option = selectedOption
        let message: string = ""
        if (option === 1)
            message = "Esta opción resetea los predicados más viejos (más de 6 meses) pero deja los no abonados como están"
        else if (option === 2)
            message = "Esta opción resetea todos los predicados pero deja los no abonados como están"
        else if (option === 3)
            message = "Esta opción resetea los predicados y no abonados más viejos (de más de 6 meses)"
        else if (option === 4)
            message = "Esta opción resetea todos los predicados y los no abonados"
        else return
        dispatch(setValuesAndOpenAlertModalReducer({
            showingAlertModal: true,
            mode: 'confirm',
            title: `¿Resetear Territorio ${territory}?`,
            message,
            execution: resetNowHandler
        }))
    }
    
    const resetNowHandler = async (): Promise<void> => {
        if (!territory || !option) return
        const success: boolean = await resetTerritoryService(territory, option)
        if (success) window.location.reload()
    }

    useEffect(() => {
        if (territory && households && households.length) {
            const statistics0: typeLocalStatistic = {
                count: households.length,
                countContesto: households.filter(x => x.estado === contesto && !x.noAbonado).length,
                countNoContesto: households.filter(x => x.estado === noContesto && !x.noAbonado).length,
                countDejarCarta: households.filter(x => x.estado === aDejarCarta && !x.noAbonado).length,
                countNoLlamar: households.filter(x => x.estado === noLlamar && !x.noAbonado).length,
                countNoAbonado: households.filter(x => x.noAbonado).length,
                libres: households.filter(x => x.estado === noPredicado && !x.noAbonado).length,
                territorio: territory
            }
            console.log(statistics0)
            setLocalStatistics(statistics0)

            const llamadas: number = statistics0.countContesto + statistics0.countNoContesto + statistics0.countNoLlamar + statistics0.countDejarCarta
            const llamadasRel: number = Math.round(llamadas / statistics0.count * 1000 ) / 10
            const predicadas: number = statistics0.countContesto + statistics0.countNoLlamar + statistics0.countDejarCarta
            // const predicadasRel: number = datos ? Math.round((datos.countContesto + datos.countNoLlamar + datos.countDejarCarta)*10000/datos.count/10)/10 : 0
            // const noContestoRel: number = datos ? Math.round(datos.countNoContesto*10000/datos.count/10)/10 : 0
            // const contestoRel: number = datos ? Math.round(datos.countContesto*10000/datos.count/10)/10 : 0
            // const aDejarCartaRel: number = datos ? Math.round(datos.countDejarCarta*10000/datos.count/10)/10 : 0
            // const noLlamarRel: number = datos ? Math.round(datos.countNoLlamar*10000/datos.count/10)/10 : 0
            setProcessedData({
                llamadas,
                llamadasRel,
                predicadas
            })
        }
    }, [households, territory])
    
    return (
    <>        
        <H2 title={"ESTADÍSTICAS"} />

        {localStatistics && processedData
        ?
            <div style={{ margin: isMobile ? '0' : '0 10%' }}>

                <br/>

                <Card
                    className={isDarkMode ? 'bg-dark text-white' : ''}
                    style={{ padding: '35px', textAlign: isMobile ? 'center' : 'left' }}
                >

                    <h3 className={'text-center mt-3'}>{`Generales`}</h3>

                    <br/>

                    <h4>{`Hay ${localStatistics.count} viviendas: ${localStatistics.count - localStatistics.countNoAbonado} abonadas y ${localStatistics.countNoAbonado} no abonadas`} </h4>

                    <br/>

                    <h4> Libres para llamar: {localStatistics.libres} <span style={{ fontSize: 21 }}>({(1000 - Math.round(processedData.llamadasRel*10))/10}%)</span> </h4>

                    <br/>

                    <h4> Llamadas: {processedData.llamadas} <span style={{ fontSize: 21 }}>({processedData.llamadasRel}%)</span></h4>

                    <br/>

                    <hr />

                    <h3 className={'text-center mt-3'}>{`Composición de Llamadas (${processedData.llamadas})`}</h3>

                    <br/>

                    <h4>{`No abonados: ${localStatistics.countNoAbonado} viviendas`} </h4>

                    <br/>

                    <h4>{`No contestó: ${localStatistics.countNoContesto} viviendas`} </h4>
                    
                    <br/>

                    <h4 className={'mb-3'}>{`Predicadas: ${processedData.predicadas} viviendas`} </h4>

                    <h4> &nbsp;&nbsp; {`-Contestó: ${localStatistics.countContesto} viviendas`} </h4>

                    <h4> &nbsp;&nbsp; {`-A dejar carta: ${localStatistics.countDejarCarta} viviendas`} </h4>

                    <h4> &nbsp;&nbsp; {`-No llamar: ${localStatistics.countNoLlamar} viviendas`} </h4>

                    {stateOfTerritory && stateOfTerritory.resetDate && !!stateOfTerritory.resetDate.length &&
                        <>
                            <hr />
                            <h3 className={'text-center mt-3'}>{`Reseteos del territorio ${territory}`}</h3>
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

                <div className={'container mt-5'} style={{ maxWidth: '450px' }}>
                    <button className={'btn btn-general-red btn-block d-block mx-auto mb-4 p-3'}
                        onClick={() => resetHandler(1)}
                        style={{ fontSize: '1.1rem' }}
                    >
                        Limpiar los de más de 6 meses (menos los no abonados)
                    </button>
                    <button className={'btn btn-general-red btn-block d-block mx-auto mb-4 p-3'}
                        onClick={() => resetHandler(2)}
                        style={{ fontSize: '1.1rem' }}
                    >
                        Limpiar todos (menos los no abonados)
                    </button>
                    <button className={'btn btn-general-red btn-block d-block mx-auto mb-4 p-3'}
                        onClick={() => resetHandler(3)}
                        style={{ fontSize: '1.1rem' }}
                    >
                        Limpiar los de más de 6 meses
                    </button>
                    <button className={'btn btn-general-red btn-block d-block mx-auto mb-4 p-3'}
                        onClick={() => resetHandler(4)}
                        style={{ fontSize: '1.1rem' }}
                    >
                        Limpiar absolutamente todos
                    </button>
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
