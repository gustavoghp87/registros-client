import { getHTHTerritoriesForStatisticsService } from '../../services'
import { H2, Hr, Loading } from '../commons'
import { typeHTHTerritory, typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setValuesAndOpenAlertModalReducer } from '../../store'

export const StatisticsHTH = () => {
    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [isLoading, setIsLoading] = useState(true)
    const [hthTerritories, setHthTerritories] = useState<typeHTHTerritory[]|null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        getHTHTerritoriesForStatisticsService().then(territories => {
            setIsLoading(false)
            if (!territories) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "No se pudieron obtener los territorios de Casa en Casa. Refrescar. Ver si hay internet.",
                    animation: 2
                }))
                return
            }
            console.log(territories);
            
            setHthTerritories(territories)
        })
    }, [dispatch])

    if (isLoading) return <Loading mt={'50px'} />

    return (
        <div className='container'>
            <H2 title={'ESTADÍSTICAS DE CASA EN CASA'} mb={'40px'} />
            {!!hthTerritories?.length ?
                <div>
                    <h3 className={isDarkMode ? 'text-white' : ''}>
                        Cantidad total de edificios: {hthTerritories.map(t => t.map.polygons.map(x => x.buildings?.length || 0).reduce((a, n) => a + n, 0)).reduce((a, n) => a + n, 0)}
                    </h3>
                    <Hr classes={'mt-5 mx-5'} />
                    {hthTerritories.sort((a, b) => parseInt(a.territoryNumber) - parseInt(b.territoryNumber)).map(t =>
                        <div key={t.territoryNumber} className={'my-5'}>
                            <h3 className={isDarkMode ? 'text-white' : ''}>
                                Territorio {t.territoryNumber}
                            </h3>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Cantidad de edificios: {t.map.polygons.map(x => x.buildings?.length || 0).reduce((a, n) => a + n, 0)}
                            </h5>
                            {/* {t.map.polygons.sort((a, b) => parseInt(a.block) - parseInt(b.block) || a.face.localeCompare(b.face)).map(manzana =>
                                <>
                                    {!!manzana.buildings?.length && <>
                                        {(manzana.face === 'A'
                                            || (manzana.face === 'B' && !t.map.polygons.find(x => x.block === manzana.block && x.face === 'A' && !!x.buildings?.length))
                                            || (manzana.face === 'C' && !t.map.polygons.find(x => x.block === manzana.block && ['A', 'B'].includes(x.face) && !!x.buildings?.length))
                                            || (manzana.face === 'D' && !t.map.polygons.find(x => x.block === manzana.block && ['A', 'B', 'C'].includes(x.face) && !!x.buildings?.length))
                                        ) && <h4 className='mt-3'>Manzana {manzana.block}</h4>}
                                        {manzana.buildings?.sort((a, b) => a.streetNumber - b.streetNumber).map(edificio =>
                                            <>
                                                <h5>{manzana.street} {edificio.streetNumber} {edificio.streetNumber2 ? `- ${edificio.streetNumber2}` : ''} {edificio.streetNumber3 ? `- ${edificio.streetNumber3}` : ''}</h5>
                                            </>
                                        )}
                                    </>}
                                </>
                            )} */}
                        </div>
                    )}
                </div>
                :
                <h4 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
                    No hay datos
                </h4>
            }
        </div>
    )
}
