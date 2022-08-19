import { useEffect, useState } from 'react'
import { WarningToaster } from '../commons'
import { typeHousehold } from '../../models'
import { getNumberOfFreePhones } from '../../services'

export const FewHouseholdsWarning = (props: any) => {

    const households: typeHousehold[] = props.households
    const [numberOfFreePhones, setNumberOfFreePhones] = useState<number>()
    const [showToaster, setShowToaster] = useState<boolean>(true)

    const closeWarningToaster = (): void => setShowToaster(false)
    
    useEffect(() => {
        if (households && households.length) setNumberOfFreePhones(getNumberOfFreePhones(households))
        return () => setNumberOfFreePhones(undefined)
    }, [households])

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
