import { useEffect, useState } from 'react'
import { Toast } from 'react-bootstrap'
import { AiOutlineWarning } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { localStatistic } from '../../models/statistic'
import { typeParam } from '../../models/typesTerritorios'
import { getLocalStatisticsService } from '../../services/statisticsServices'

export const BsToaster = (props:any) => {

    const { territorio } = useParams<typeParam>()
    const [showA, setShowA] = useState<boolean>(true)
    const [localStat, setLocalStat] = useState<localStatistic>()
    
    const toggleShowA = () => setShowA(!showA)

    useEffect(() => {
        (async () => {
            const datos: localStatistic|null = await getLocalStatisticsService(territorio)
            if (datos) setLocalStat(datos)
        })()
    }, [territorio])

    return (
        <>
            {localStat &&
                localStat !== null && localStat !== undefined &&
                localStat.libres !== null && localStat.libres !== undefined &&
                localStat.libres < 50 ?

                <Toast className="mt-5 mx-auto" show={showA} onClose={toggleShowA}>
                    <Toast.Header className="d-block">
                        <AiOutlineWarning className="m-1" style={{fontSize:18}} />
                        <span className="">
                            <strong> ¡Advertencia! </strong>
                        </span>
                    </Toast.Header>
                    <Toast.Body>
                        {localStat.libres > 0 ?
                            <span> A este territorio le quedan solo {localStat.libres} teléfonos para llamar </span>
                            :
                            <span> No quedan teléfonos para llamar </span>
                        }
                    </Toast.Body>
                </Toast>
                
            :
            <></>
            }
        </>
    )
}
