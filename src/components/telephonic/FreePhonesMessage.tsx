import { FC, useMemo } from 'react'
import { generalBlue } from '../../constants'
import { typeBlock, typeHousehold, typeRootState, typeTerritoryNumber } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    currentBlock?: typeBlock
    households: typeHousehold[]
    loaded: boolean
    territoryNumber: typeTerritoryNumber
}

export const FreePhonesMessage: FC<propsType> = ({ currentBlock, households, loaded, territoryNumber }) => {
    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))

    const freePhones: number|undefined = useMemo(() => {
        let currentHouseholds: typeHousehold[] = households
        if (!currentHouseholds || !currentHouseholds.length || !currentBlock) return undefined
        currentHouseholds = currentHouseholds.filter(x => x.block === currentBlock && x.callingState === 'No predicado' && !x.notSubscribed)
        return currentHouseholds.length
    }, [currentBlock, households])

    return (
        <>
            {!!freePhones &&
                <h3 className={'text-center text-white mb-5 py-3'} style={{ backgroundColor: generalBlue }}>
                    En esta manzana hay {freePhones} teléfonos libres
                </h3>
            }

            {!freePhones && loaded && currentBlock &&
                <h3 className={`text-center mb-4 ${isDarkMode ? 'text-white' : ''}`}>
                    No hay viviendas no llamadas en esta manzana {currentBlock} del territorio {territoryNumber}
                </h3>
            }
        </>
    )
}
