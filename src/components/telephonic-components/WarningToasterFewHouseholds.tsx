import { useEffect, useState } from 'react'
import { Toast } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { AiOutlineWarning } from 'react-icons/ai'
import { getNumberOfFreePhonesService } from '../../services'

export const WarningToasterFewHouseholds = () => {

    const { territorio } = useParams<string>()
    const [numberOfFreePhones, setNumberOfFreePhones] = useState<number>()
    const [showA, setShowA] = useState<boolean>(true)
    
    const toggleShowA = () => setShowA(!showA)
    
    useEffect(() => {
        if (territorio) getNumberOfFreePhonesService(territorio)
            .then((data: number|null) => { if (data !== null) setNumberOfFreePhones(data) })
        return () => setNumberOfFreePhones(undefined)
    }, [territorio])

    return (
        <>
            {numberOfFreePhones !== undefined && numberOfFreePhones < 50 &&
                <Toast className={'mt-5 mx-auto pr-2'} show={showA} onClose={toggleShowA}>
                    <Toast.Header className={'d-flex justify-content-between'}>
                        <span className={'mt-1'}>
                            <AiOutlineWarning className={'mb-1 ml-3'} style={{ fontSize: 22 }} />
                            <span style={{ fontSize: 17 }}>
                                <strong> ¡Advertencia! </strong>
                            </span>
                        </span>
                    </Toast.Header>
                    <Toast.Body className={'pl-4 pt-2'}>
                        {numberOfFreePhones > 0
                            ?
                            <span> A este territorio le quedan solo {numberOfFreePhones} teléfonos para llamar </span>
                            :
                            <span> No quedan teléfonos para llamar </span>
                        }
                    </Toast.Body>
                </Toast>
            }
        </>
    )
}
