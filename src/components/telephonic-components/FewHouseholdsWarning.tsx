import { useEffect, useState } from 'react'
import { WarningToaster } from '../commons'
import { getNumberOfFreePhonesService } from '../../services'
import { typeHousehold, typeTerritoryNumber } from '../../models'

export const FewHouseholdsWarning = (props: any) => {

    const households: typeHousehold[] = props.households
    const territory: typeTerritoryNumber = props.territory
    const [numberOfFreePhones, setNumberOfFreePhones] = useState<number>()
    const [showToaster, setShowToaster] = useState<boolean>(true)

    const closeWarningToaster = (): void => setShowToaster(false)
    
    useEffect(() => {
        if (territory) getNumberOfFreePhonesService(territory).then((numberOfFreePhones0: number|null) => {
            if (numberOfFreePhones0 !== null) setNumberOfFreePhones(numberOfFreePhones0)
        })
        return () => setNumberOfFreePhones(undefined)
    }, [households, territory])

    return (
        <>
            {showToaster && numberOfFreePhones !== undefined && numberOfFreePhones < 50 &&
                <WarningToaster
                    bodyText={numberOfFreePhones > 0 ?
                        <span> A este territorio le quedan solo {numberOfFreePhones} teléfonos para llamar </span>
                        :
                        <span> No quedan teléfonos para llamar </span>}
                    closeWarningToaster={closeWarningToaster}
                    headerText={<strong>Recordar pedir otro</strong>}
                />
            }
        </>
    )
}
