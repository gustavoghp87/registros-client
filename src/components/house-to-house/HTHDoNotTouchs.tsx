import { FC } from 'react'
import { Hr } from '../commons'
import { typeHTHTerritory, typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    hthTerritory: typeHTHTerritory
}

export const HTHDoNotTouchs: FC<propsType> = ({ hthTerritory }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const doNotTouchs = hthTerritory.map.polygons.map(p => p.doNotCalls.map(d => ({ street: p.street, doNotCall: d }))).flat()

    return (<>
        {doNotTouchs.length ?
            <div className={'text-center'}>
                <Hr classes={'mt-5'} />
                <h2 className={`${isDarkMode ? 'text-white' : ''} my-5`}>
                    No tocar del Territorio:
                </h2>
                {doNotTouchs.map(d =>
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
