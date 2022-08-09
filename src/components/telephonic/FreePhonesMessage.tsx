import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { generalBlue, typeBlock, typeHousehold, typeRootState, typeTerritoryNumber } from '../../models'

export const FreePhonesMessage = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const currentBlock: typeBlock = props.currentBlock
    const households: typeHousehold[] = props.households
    const loaded: boolean = props.loaded
    const territoryNumber: typeTerritoryNumber = props.territoryNumber

    const freePhones: number|undefined = useMemo(() => {
        let currentHouseholds: typeHousehold[] = households
        if (!currentHouseholds || !currentHouseholds.length || !currentBlock) return undefined
        currentHouseholds = currentHouseholds.filter(x => x.manzana === currentBlock && x.estado === 'No predicado' && !x.noAbonado)
        return currentHouseholds.length
    }, [currentBlock, households])

    return (
        <>
            {freePhones &&
                <h3 className={'text-center text-white mb-5 py-3'} style={{ backgroundColor: generalBlue }}>
                    En esta manzana hay {freePhones} teléfonos libres
                </h3>
            }

            {!freePhones && loaded && currentBlock &&
                <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                    <br/>
                    No hay viviendas no llamadas en esta manzana {currentBlock} del territorio {territoryNumber}
                </h3>
            }
        </>
    )
}
