import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { H2, Loading } from '../commons'
import { getGlobalStatistics1Service } from '../../services'
// import { getLocalStatisticsService, getGlobalStatisticsService } from '../../services'
import { typeRootState, typeTerritoryRow } from '../../models'

export const Statistics = () => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    // const [globalS, setGlobalStatistics] = useState<typeTelephonicStatistic>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    // useEffect(() => {
    //     getGlobalStatisticsService().then((data: typeTelephonicStatistic|null) => {
    //         setIsLoading(false)
    //         if (!data) return
    //         data.numberOf_ADejarCarta_relative = Math.round((data.numberOf_ADejarCarta * 100)/data.numberOfHouseholds)
    //         data.numberOf_FreePhones = data.numberOfHouseholds - data.numberOf_ADejarCarta - data.numberOf_Contesto - data.numberOf_NoAbonado - data.numberOf_NoContesto - data.numberOf_NoLlamar
    //         data.numberOf_NoContesto_relative = Math.round((data.numberOf_Contesto * 100)/data.numberOfHouseholds)
    //         data.numberOf_NoLlamar_relative = Math.round((data.numberOf_NoLlamar * 100)/data.numberOfHouseholds)
    //         data.numberOfAlreadyCalled = data.numberOf_Contesto + data.numberOf_NoContesto + data.numberOf_NoLlamar + data.numberOf_NoAbonado
    //         data.numberOfAlreadyCalledRelative = Math.round((data.numberOfAlreadyCalled * 100)/data.numberOfHouseholds)
    //         data.numberOfAlreadyDone = data.numberOf_Contesto + data.numberOf_NoLlamar + data.numberOf_ADejarCarta
    //         data.numberOfAlreadyDoneRelative = Math.round((data.numberOfAlreadyCalled * 100)/data.numberOfHouseholds)
    //         setGlobalStatistics(data)
    //     })
    //     return () => setGlobalStatistics(undefined)
    // }, [])

    return (
    <>
        <H2 title={"ESTADÍSTICAS DE LA TELEFÓNICA"} />

        <Section3
            isLoading={isLoading}
            isMobile={isMobile}
            setIsLoading={setIsLoading}
            isDarkMode={isDarkMode}
        />
        
        {/* <br/>
        <br/> */}

        {/* <Section1 globalS={globalS} isDarkMode={isDarkMode} isMobile={isMobile} />

        <br/>
        <br/>

        <Section2 globalS={globalS} isMobile={isMobile} setIsLoading={setIsLoading}  /> */}

    </>
    )
}

// const Section1 = ({ globalS, isDarkMode, isMobile }: { globalS: any, isDarkMode: boolean, isMobile: boolean }) => {

//     return (<>
//         {globalS ?
//             <div style={{ margin: isMobile ? '0' : '0 10%' }}>
//                 <br/>
//                 <br/>
//                 <div
//                     className={`card ${isDarkMode ? 'bg-dark text-white' : ''}`}
//                     style={{ padding: '35px', textAlign: isMobile ? 'center' : undefined }}
//                 >

//                     <h4> Hay {globalS.numberOfHouseholds} viviendas, {globalS.numberOf_NoAbonado} no abonadas. Neto: {globalS.numberOfHouseholds - globalS.numberOf_NoAbonado} </h4>

//                     <br/>

//                     <h4> Llamadas: {globalS.numberOfAlreadyCalled} ({globalS.numberOfAlreadyCalledRelative}%) (Predicadas (sin cartas) + No contestó + No abonadas) </h4>

//                     <br/>

//                     <h4> Libres para llamar: {globalS.numberOf_FreePhones} </h4>

//                     <Hr />

//                     <h4> Predicadas: {globalS.numberOfAlreadyDone} viviendas ({globalS.numberOfAlreadyDoneRelative}%) </h4>

//                     <br/>

//                     <h4> &nbsp;&nbsp; Contestó: {globalS.numberOf_Contesto} viviendas ({globalS.numberOf_NoContesto_relative}%) </h4>

//                     <h4> &nbsp;&nbsp; A dejar carta: {globalS.numberOf_ADejarCarta} viviendas ({globalS.numberOf_ADejarCarta_relative}%) </h4>

//                     <h4> &nbsp;&nbsp; No llamar: {globalS.numberOf_NoLlamar} viviendas ({globalS.numberOf_NoLlamar_relative}%) </h4>

//                     <br/>

//                     <h4> No contestó: {globalS.numberOf_NoContesto} viviendas ({globalS.numberOf_NoContesto_relative}%) </h4>

//                 </div>

//             </div>
//         :
//             <Loading mt={'50px'} />
//         }
//     </>)
// }

// const Section2 = (props: any) => {
//     const navigate = useNavigate()
//     const globalS: typeTelephonicStatistic = props.globalS
//     const setIsLoading = props.setIsLoading
//     const isMobile: boolean = props.isMobile
//     const [localS, setLocalStatistics] = useState<typeLocalTelephonicStatistic[]>([])
//     const [showBtn, setShowBtn] = useState<boolean>(true)
//     const [showBtn1, setShowBtn1] = useState<boolean>(true)


//     const retrieveLocalStats = async (): Promise<void> => {
//         setIsLoading(true)
//         setShowBtn(false)
//         const allLocalStatistics: typeLocalTelephonicStatistic[]|null = await getLocalStatisticsService()
//         setIsLoading(false)
//         if (!allLocalStatistics) return
//         setLocalStatistics(allLocalStatistics)
//     }

//     const orderLocalStatistics = (): void => {
//         setShowBtn1(false)
//         let orderedLocalS0 = localS.filter(x => x.stateOfTerritory.isFinished)
//         let orderedLocalS1 = localS.filter(x => !x.stateOfTerritory.isFinished)
//         let orderedLocalS2 = orderedLocalS0.filter(x => x.stateOfTerritory.resetDates?.length)
//         let orderedLocalS3 = orderedLocalS0.filter(x => !x.stateOfTerritory.resetDates?.length)
//         orderedLocalS2 = orderedLocalS2.sort((b, a) =>
//             b.stateOfTerritory.resetDates[b.stateOfTerritory.resetDates.length - 1].date - a.stateOfTerritory.resetDates[a.stateOfTerritory.resetDates.length - 1].date
//         )
//         setLocalStatistics(orderedLocalS2.concat(orderedLocalS3.concat(orderedLocalS1)))
//     }

//     return (<>
//         {showBtn && globalS &&
//             <button
//                 className={'btn btn-general-blue d-block mx-auto'}
//                 onClick={() => retrieveLocalStats()}
//                 style={{
//                     backgroundColor: generalBlue,
//                     border: '1px solid ' + generalBlue,
//                     borderRadius: '5px'
//                 }}
//             >
//                 Traer Estadísticas por Territorio
//             </button>
//         }

//         {localS && !!localS.length && <>
//             {showBtn1 &&
//                 <button className={'btn btn-general-blue d-block mx-auto my-3'}
//                     onClick={() => orderLocalStatistics()}
//                 >
//                     Ver primero los Terminados y ordenados por los reseteados hace más tiempo primero
//                 </button>
//             }
//             {localS.map((territory: typeLocalTelephonicStatistic) =>
//                 <div
//                     key={territory.territoryNumber}
//                     className={`card d-block mx-auto mt-3 pointer ${territory.numberOf_FreePhones < 50 ? 'bg-danger' : (territory.numberOf_FreePhones < 100 ? 'bg-warning': 'bg-success')} ${territory.isFinished ? 'animate__animated animate__flash animate__infinite animate__slower' : ''}`}
//                     style = {{
//                         color: 'black',
//                         marginBottom: '20px',
//                         maxWidth: isMobile ? '80%' : '55%',
//                         padding: '35px',
//                         textAlign: isMobile ? 'center' : undefined
//                     }}
//                     onClick={() => navigate(`/telefonica/${territory.territoryNumber}`)}
//                 >
//                     <h3> Territorio {territory.territoryNumber} {territory.isFinished ? '- TERMINADO' : ''} </h3>
//                     <h4> Quedan {territory.numberOf_FreePhones} para predicar </h4>
//                 </div>
//             )}
//         </>}
//     </>)
// }


const Section3 = (props: any) => {

    const isLoading: boolean = props.isLoading
    const setIsLoading: Function = props.setIsLoading
    const isDarkMode: boolean = props.isDarkMode
    const isMobile: boolean = props.isMobile
    const navigate = useNavigate()
    const [territories, setTerritories] = useState<typeTerritoryRow[]>()
    const [showOpened, setShowOpened] = useState(true)
    const [selectedOption, setSelectedOption] = useState(1)

    const setSelectedOptionHandler = (value: number): void => {
        setSelectedOption(value)
        if (value === 1) orderByTerritoryNumber()
        else if (value === 2) orderByLastTime()
        else if (value === 3) orderByLeftRel()
        else if (value === 4) orderByTotal()
    }
    
    const orderByTerritoryNumber = (): void => {
        setTerritories(x => x ? [...x].sort((a, b) => a.territoryNumber - b.territoryNumber) : x)
    }

    const orderByLastTime = (): void => {
        setTerritories(x => x ? [...x].sort((a, b) => new Date(a.last).getTime() - new Date(b.last).getTime()) : x)
    }

    const orderByLeftRel = (): void => {
        setTerritories(x => x ? [...x].sort((a, b) =>
            a.leftRel === '-' ?
                parseFloat(b.leftRel)
                :
                b.leftRel === '-' ?
                    parseFloat(a.leftRel)
                    :
                    parseFloat(b.leftRel) - parseFloat(a.leftRel)
            )
            :
            x
        )
    }

    const orderByTotal = (): void => {
        setTerritories(x => x ? [...x].sort((a, b) => b.total - a.total) : x)
    }

    useEffect(() => {
        getGlobalStatistics1Service().then((territories0) => {
            setIsLoading(false)
            if (territories0) setTerritories(territories0)
        })
    }, [])

    if (isLoading) return <Loading mt={'60px'} mb={'20px'} />

    return (<>
        <div className={'my-4'}>
            <div className={'row'}>
                <div className={'mx-auto'} style={{ width: '300px' }}>
                    <div className={'form-check'}>
                        <label className={`form-check-label ${isDarkMode ? 'text-white' : ''}`} htmlFor={'frd1'}>
                            Ordenar por territorio
                        </label>
                        <input className={'form-check-input ms-0 me-2'}
                            type={'radio'} name={'frd'} id={'frd1'} value={1}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSelectedOptionHandler(parseInt(e.target.value))}
                            checked={selectedOption === 1}
                        />
                    </div>
                    <div className={'form-check'}>
                        <label className={`form-check-label ${isDarkMode ? 'text-white' : ''}`} htmlFor={'frd2'}>
                            Ordenar por última vez
                        </label>
                        <input className={'form-check-input ms-0 me-2'}
                            type={'radio'} name={'frd'} id={'frd2'} value={2}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSelectedOptionHandler(parseInt(e.target.value))}
                            checked={selectedOption === 2}
                        />
                    </div>
                    <div className={'form-check'}>
                        <label className={`form-check-label ${isDarkMode ? 'text-white' : ''}`} htmlFor={'frd3'}>
                            Ordenar por % de completado
                        </label>
                        <input className={'form-check-input ms-0 me-2'}
                            type={'radio'} name={'frd'} id={'frd3'} value={3}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSelectedOptionHandler(parseInt(e.target.value))}
                            checked={selectedOption === 3}
                        />
                    </div>
                    <div className={'form-check'}>
                        <label className={`form-check-label ${isDarkMode ? 'text-white' : ''}`} htmlFor={'frd4'}>
                            Ordenar por tamaño
                        </label>
                        <input className={'form-check-input ms-0 me-2'}
                            type={'radio'} name={'frd'} id={'frd4'} value={4}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSelectedOptionHandler(parseInt(e.target.value))}
                            checked={selectedOption === 4}
                        />
                    </div>
                    <div className={'form-check mt-2'}>
                        <input className={'form-check-input ms-0 me-2'} type={'checkbox'} id={'fcc1'}
                            value={''} checked={showOpened} onChange={() => setShowOpened(x => !x)}
                        />
                        <label className={`form-check-label ${isDarkMode ? 'text-white' : ''}`} htmlFor={'fcc1'}>
                            Ver Abiertos
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <table className={`text-center table ${isDarkMode ? 'table-dark' : ''} table-hover pointer`}>
            <thead>
                <tr>
                    <th scope={'col'}>TERR</th>
                    <th scope={'col'}>ASIGNADO A</th>
                    <th scope={'col'}>ESTADO</th>
                    <th scope={'col'}>QUEDAN</th>
                    <th scope={'col'}>TOTAL</th>
                    <th scope={'col'}>QUEDAN</th>
                    <th scope={'col'}>ULT. VEZ</th>
                </tr>
            </thead>
            <tbody>
                {!!territories?.length && territories.map(territory =>
                    <tr key={territory.territoryNumber}
                        className={territory.opened && !showOpened ? 'd-none' : ''}
                        onClick={() => navigate(`/telefonica/${territory.territoryNumber}`)}
                    >
                        <th scope={'row'}> {territory.territoryNumber} </th>
                        
                        <td style={{ maxWidth: '350px' }}>
                            {territory.assigned?.length ? territory.assigned.join(', ') : "-"}
                        </td>
                        
                        <td className={` ${territory.opened ? 'bg-success' : 'bg-danger'} `}>
                            {territory.opened ? 'ABIERTO' : 'CERRADO'}
                        </td>
                        
                        <td>{territory.left}</td>
                        <td>{territory.total}</td>
                        <td>{territory.leftRel}</td>
                        <td>{territory.last}</td>
                    </tr>
                )}
            </tbody>
        </table>
    </>)
}
