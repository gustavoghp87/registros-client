import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'react-bootstrap'
import { H2, Hr, Loading } from '../commons'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { resetTerritoryService, timeConverter } from '../../services'
import { typeAppDispatch, typeLocalTelephonicStatistic, typeResetDate, typeRootState, typeTelephonicTerritory } from '../../models'

type typeOption = 1 | 2 | 3 | 4

export const LocalStatistics = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const telephonicTerritory: typeTelephonicTerritory = props.telephonicTerritory
    const [localS, setLocalStatistics] = useState<typeLocalTelephonicStatistic>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
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
            mode: 'confirm',
            title: `¿Resetear Territorio ${telephonicTerritory.territoryNumber}?`,
            message,
            execution: resetNowHandler
        }))
    }
    
    const resetNowHandler = async (): Promise<void> => {
        if (!option) return
        setIsLoading(true)
        const modifiedCount: number|null = await resetTerritoryService(telephonicTerritory.territoryNumber, option)
        setIsLoading(false)
        if (modifiedCount === null) dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: "Error",
            message: "Algo falló y no se pudo resetear el territorio.",
            animation: 2
        }))
        else if (modifiedCount > 0) dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Terminado",
            message: `Se resetearon las viviendas usando la opción ${option}`,
            execution: () => window.location.reload(),
            animation: 1
        }))
        else dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: "No se hicieron cambios",
            message: `Parece que con la opción ${option} no queda ninguna vivienda para resetear.`
        }))
    }

    useEffect(() => {
        if (!telephonicTerritory.households.length) return
        const statistics0: typeLocalTelephonicStatistic = {
            isFinished: telephonicTerritory.stateOfTerritory.isFinished,
            numberOfHouseholds: telephonicTerritory.households.length,
            numberOf_Contesto: telephonicTerritory.households.filter(x => x.callingState === 'Contestó' && !x.notSubscribed).length,
            numberOf_NoContesto: telephonicTerritory.households.filter(x => x.callingState === 'No contestó' && !x.notSubscribed).length,
            numberOf_ADejarCarta: telephonicTerritory.households.filter(x => x.callingState === 'A dejar carta' && !x.notSubscribed).length,
            numberOf_NoLlamar: telephonicTerritory.households.filter(x => x.callingState === 'No llamar' && !x.notSubscribed).length,
            numberOf_NoAbonado: telephonicTerritory.households.filter(x => x.notSubscribed).length,
            numberOf_FreePhones: telephonicTerritory.households.filter(x => x.callingState === 'No predicado' && !x.notSubscribed).length,
            territoryNumber: telephonicTerritory.territoryNumber,
            numberOf_ADejarCarta_relative: 0,
            numberOf_NoLlamar_relative: 0,
            numberOfAlreadyCalled: 0,
            numberOfAlreadyCalledRelative: 0,
            numberOfAlreadyDone: 0,
            numberOfAlreadyDoneRelative: 0,
            numberOf_NoContesto_relative: 0
        }
        statistics0.numberOfAlreadyCalled = statistics0.numberOf_Contesto + statistics0.numberOf_NoContesto + statistics0.numberOf_NoLlamar + statistics0.numberOf_ADejarCarta + statistics0.numberOf_NoAbonado
        statistics0.numberOfAlreadyCalledRelative = Math.round(statistics0.numberOfAlreadyCalled * 100/statistics0.numberOfHouseholds)
        statistics0.numberOfAlreadyDone = statistics0.numberOf_Contesto + statistics0.numberOf_NoLlamar + statistics0.numberOf_ADejarCarta
        statistics0.numberOf_FreePhones_relative = Math.round((statistics0.numberOf_FreePhones * 100)/statistics0.numberOfHouseholds)
        setLocalStatistics(statistics0)
    }, [telephonicTerritory])
    
    if (!localS) {
        return <Loading mt={'40px'} />
    }
    
    return (
    <>        
        <H2 title={"ESTADÍSTICAS"} mb={'30px'} />

        <div style={{ margin: isMobile ? '0' : '0 10%' }}>

            <br/>

            <Card className={`px-5 py-3 ${isMobile ? 'text-center' : ''} ${isDarkMode ? 'bg-dark text-white' : ''}`}>

                <h1 className={'text-center mt-3'}> Generales </h1>

                <br/>

                <h4> Hay {localS.numberOfHouseholds} viviendas: {localS.numberOfHouseholds - localS.numberOf_NoAbonado} abonadas y {localS.numberOf_NoAbonado} no abonadas </h4>

                <br/>

                <h4> Libres para llamar: {localS.numberOf_FreePhones} <span style={{ fontSize: 21 }}>({localS.numberOf_FreePhones_relative}%)</span> </h4>

                <br/>

                <h4> Llamadas: {localS.numberOfAlreadyCalled} <span style={{ fontSize: 21 }}>({localS.numberOfAlreadyCalledRelative}%)</span></h4>

                <br/>

                <Hr />

                <h3 className={'text-center mt-3'}> Composición de Llamadas ({localS.numberOfAlreadyCalled}) </h3>

                <br/>

                <h4> No abonados: {localS.numberOf_NoAbonado} viviendas </h4>

                <br/>

                <h4> No contestó: {localS.numberOf_NoContesto} viviendas </h4>
                
                <br/>

                <h4 className={'mb-3'}> Predicadas: {localS.numberOfAlreadyDone} viviendas </h4>

                <h4> &nbsp;&nbsp; -Contestó: {localS.numberOf_Contesto} viviendas </h4>

                <h4> &nbsp;&nbsp; -A dejar carta: {localS.numberOf_ADejarCarta} viviendas </h4>

                <h4> &nbsp;&nbsp; -No llamar: {localS.numberOf_NoLlamar} viviendas </h4>

                <br/>

                {!!telephonicTerritory.stateOfTerritory.resetDates.length &&
                    <div className={'my-4'}>
                        <Hr />
                        <h3 className={'text-center my-4'}> Reseteos del territorio {telephonicTerritory.territoryNumber} </h3>
                        {telephonicTerritory.stateOfTerritory.resetDates.map((reset: typeResetDate, index: number) =>
                            <h4 key={index}>
                                &nbsp; -El {timeConverter(reset.date)} con la opción {reset.option}
                            </h4>
                        )}
                    </div>
                }
            </Card>

            {isLoading ?
                <Loading mt={'50px'} />
                :
                <div className={'container mt-5'} style={{ maxWidth: '450px' }}>
                    <button className={'btn btn-general-red btn-size12 w-100 mb-4 p-3'}
                        onClick={() => resetHandler(1)}
                    >
                        Limpiar los de más de 6 meses<br/>menos los no abonados
                    </button>
                    <button className={'btn btn-general-red btn-size12 w-100 mb-4 p-3'}
                        onClick={() => resetHandler(2)}
                    >
                        Limpiar todos<br/>menos los no abonados
                    </button>
                    <button className={'btn btn-general-red btn-size12 w-100 mb-4 p-3'}
                        onClick={() => resetHandler(3)}
                    >
                        Limpiar los de más de 6 meses<br/>incluso los no abonados
                    </button>
                    <button className={'btn btn-general-red btn-size12 w-100 mb-4 p-3'}
                        onClick={() => resetHandler(4)}
                    >
                        Limpiar absolutamente todos
                    </button>
                </div>
            }

        </div>
    </>
    )
}
