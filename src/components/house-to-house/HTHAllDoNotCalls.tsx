import { FC, useMemo } from 'react'
import { typeHTHTerritory, typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    hthTerritory: typeHTHTerritory
}

export const HTHAllDoNotCalls: FC<propsType> = ({ hthTerritory }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const doNotCalls = useMemo(() =>
        hthTerritory.map.polygons.map(p => p.doNotCalls.map(d => ({ street: p.street, doNotCall: d }))).flat()
    , [hthTerritory.map.polygons])

    return (<>
        {doNotCalls.length ?
            <div className={'text-center'}>
                <h2 className={`${isDarkMode ? 'text-white' : ''} my-5`}>
                    No tocar del Territorio:
                </h2>
                {doNotCalls.map(d =>
                    <h5 key={d.doNotCall.id} className={isDarkMode ? 'text-white' : ''}>
                        {d.street} {d.doNotCall.streetNumber} {d.doNotCall.doorBell} - Fecha {d.doNotCall.date}
                    </h5>
                )}
            </div>
            :
            <h4 className={`text-center mt-4 ${isDarkMode ? 'text-white' : ''}`}>
                No hay No tocar en este Territorio
            </h4>
        }
    </>)
}
