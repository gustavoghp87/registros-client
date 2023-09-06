import { getHTHTerritoriesForStatisticsService } from '../../services'
import { H2, Hr, Loading } from '../commons'
import { typeHTHTerritory, typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setValuesAndOpenAlertModalReducer } from '../../store'

export const StatisticsHTH = () => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
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

    if (isLoading) return <Loading />

    return (
        <div className='container text-center'>
            <H2 title={'ESTADÍSTICAS DE CASA EN CASA'} mb={'40px'} />
            {!!hthTerritories?.length ?
                <div>
                    <h3 className={isDarkMode ? 'text-white' : ''}>
                        Cantidad total de edificios: {hthTerritories.map(t => t.map.polygons.map(x => x.buildings?.length || 0).reduce((a, n) => a + n, 0)).reduce((a, n) => a + n, 0)}
                    </h3>
                    <Hr classes={'mt-5 mx-5'} />
                    {hthTerritories.map(t =>
                        <div className={'my-5'}>
                            <h3 className={isDarkMode ? 'text-white' : ''}>
                                Territorio {t.territoryNumber}
                            </h3>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Cantidad de edificios: {t.map.polygons.map(x => x.buildings?.length || 0).reduce((a, n) => a + n, 0)}
                            </h5>
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
