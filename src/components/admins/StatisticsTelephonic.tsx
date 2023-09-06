import { getGlobalStatistics1Service } from '../../services'
import { H2, Loading } from '../commons'
import { typeRootState, typeTerritoryRow } from '../../models'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const StatisticsTelephonic = () => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOption, setSelectedOption] = useState(1)
    const [showOpened, setShowOpened] = useState(true)
    const [territories, setTerritories] = useState<typeTerritoryRow[]>()
    const navigate = useNavigate()

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

    return (
    <>
        <H2 title={"ESTADÍSTICAS DE LA TELEFÓNICA"} />

        {isMobile && <p className={'text-center mt-3'}> Versión resumida para celulares </p>}

        <div className={'my-4'}>
            <div className={'row'}>
                {!!territories?.length &&
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
                        {!isMobile && <>
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
                        </>}
                    </div>
                }
            </div>
        </div>

        <table className={`text-center table ${isDarkMode ? 'table-dark' : ''} table-hover pointer`}>
            <thead>
                <tr>
                    <th scope={'col'}>TERR</th>
                    <th scope={'col'}>ASIGNADO A</th>
                    {!isMobile && <>
                        <th scope={'col'}>ESTADO</th>
                        <th scope={'col'}>QUEDAN</th>
                        <th scope={'col'}>TOTAL</th>
                        <th scope={'col'}>QUEDAN</th>
                    </>}
                    <th scope={'col'}>ULT. VEZ</th>
                </tr>
            </thead>
            <tbody>
                {!!territories?.length ?
                    territories.map(territory =>
                        <tr key={territory.territoryNumber}
                            className={territory.opened && !showOpened ? 'd-none' : ''}
                            onClick={() => navigate(`/telefonica/${territory.territoryNumber}`)}
                        >
                            <th scope={'row'}> {territory.territoryNumber} </th>
                            
                            <td style={{ maxWidth: '350px' }}>
                                {!!territory.assigned?.length ?
                                    territory.assigned.map(a =>
                                        <p key={a}>{a}</p>
                                    )
                                    :
                                    "-"
                                }
                            </td>
                            
                            {!isMobile && <>
                                <td className={` ${territory.opened ? 'bg-success' : 'bg-danger'} `}>
                                    {territory.opened ? 'ABIERTO' : 'CERRADO'}
                                </td>
                                
                                <td>{territory.left}</td>
                                <td>{territory.total}</td>
                                <td>{territory.leftRel}</td>
                            </>}
                            <td>{territory.last}</td>
                        </tr>
                    )
                    :
                    <tr>
                        <td colSpan={isMobile ? 3 : 7}> No hay datos </td>
                    </tr>
                }
            </tbody>
        </table>
    </>)
}
