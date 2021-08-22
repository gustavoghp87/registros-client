import { useQuery } from '@apollo/client'
import { useState } from 'react'
import * as graphql from '../../services/graphql'
import { getToken } from '../../services/getToken'
import { Toast } from 'react-bootstrap'
import { AiOutlineWarning } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { typeParam } from '../../models/typesTerritorios'

export const BsToaster:any = (props:any) => {

    const [showA, setShowA] = useState(true)
    const toggleShowA = () => setShowA(!showA)
    const { territorio } = useParams<typeParam>()

    const datos = useQuery(graphql.GETLOCALSTATISTICS,
        {variables: { token: getToken(), territorio}}
    ).data

    return (
        <>
            {datos &&
                datos.getLocalStatistics !== null && datos.getLocalStatistics !== undefined &&
                datos.getLocalStatistics.libres !== null && datos.getLocalStatistics.libres !== undefined &&
                datos.getLocalStatistics.libres < 50 ?

                <Toast className="mt-5 mx-auto" show={showA} onClose={toggleShowA}>
                    <Toast.Header className="d-block">
                        <AiOutlineWarning className="m-1" style={{fontSize:18}} />
                        <span className="">
                            <strong> ¡Advertencia! </strong>
                        </span>
                    </Toast.Header>
                    <Toast.Body>
                        {datos.getLocalStatistics.libres > 0 ?
                            <span> A este territorio le quedan solo {datos.getLocalStatistics.libres} teléfonos para llamar </span>
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
