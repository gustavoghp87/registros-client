import { useEffect, useState } from 'react'
import { Toast } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { AiOutlineWarning } from 'react-icons/ai'
import { getLocalStatisticsService } from '../../services/statisticsServices'
import { localStatistic } from '../../models/statistic'

export const BsToaster = () => {

    const { territorio } = useParams<string>()
    const [showA, setShowA] = useState<boolean>(true)
    const [localStat, setLocalStat] = useState<localStatistic>()
    
    useEffect(() => {
        if (territorio) getLocalStatisticsService(territorio)
            .then((datos: localStatistic|null) => { if (datos) setLocalStat(datos) })
    }, [territorio])

    const toggleShowA = () => setShowA(!showA)

    return (
        <>
            {localStat && localStat !== null && localStat !== undefined && localStat.libres !== null
                && localStat.libres !== undefined && localStat.libres < 50 &&

                <Toast className={'mt-5 mx-auto'} show={showA} onClose={toggleShowA}>
                    <Toast.Header className={'d-block'}>
                        <AiOutlineWarning className={'m-1'} style={{ fontSize: 18 }} />
                        <span>
                            <strong> ¡Advertencia! </strong>
                        </span>
                    </Toast.Header>
                    <Toast.Body>
                        {localStat.libres > 0
                            ?
                            <span> A este territorio le quedan solo {localStat.libres} teléfonos para llamar </span>
                            :
                            <span> No quedan teléfonos para llamar </span>
                        }
                    </Toast.Body>
                </Toast>
            }
        </>
    )
}
