import { H2 } from './css/css'
import { Card, Button } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import * as graphql from '../services/graphql'
import { Loading } from './_Loading'
import { mobile } from './_App'
import { useParams } from 'react-router'
import { typeParam } from '../models/types'
import { ReturnBtn } from './_Return'
import { Col0b } from './columns/Col0b'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { SERVER } from '../config'
import { getToken } from '../services/getToken'


function EstadisticasLocalPage(props:any) {

    const { territorio } = useParams<typeParam>()
    const datos = useQuery(graphql.GETLOCALSTATISTICS,
        {variables: { token: getToken(), territorio}}
    ).data

    const reset = async (option:number) => {
        let message = ""
        if (option===1) message = "Esta opción resetea los predicados más viejos (más de 6 meses)"
        if (option===2) message = "Esta opción resetea predicados (no hace nada con los no abonados)"
        if (option===3) message = "Esta opción resetea todos los predicados y, además, los no abonados de más de 6 meses"
        if (option===4) message = "Esta opción resetea ABSOLUTAMENTE TODO"
        confirmAlert({
            title: `¿Resetear Territorio ${territorio}?`,
            message,
            buttons: [
                { label: 'Yes', onClick: () => resetNow(option) },
                { label: 'No', onClick: () => {} }
            ]
        })
    }
    
    const resetNow = async (option:number) => {
        const response = await fetch(`${SERVER}/api/reset`, {
            method: 'POST',
            headers: {'Content-Type':'Application/json'},
            body: JSON.stringify({ token: getToken(), option, territorio})
        })
        const data = await response.json()
        if (data.success) window.location.reload()
    }


    return (
        <>
        {ReturnBtn(props)}
        
        <H2> ESTADÍSTICAS </H2>

        <h1 style={{textAlign:'center', marginBottom: mobile ? '30px' : '25px'}}>
            TERRITORIO {territorio}
        </h1>

        <Col0b
            territorio={territorio}
            isTodo={false}
            isStatistics={true}
        />


        {datos
        ?
            <div style={{margin: mobile ? '0' : '0 10%'}}>
                <br/>
                <Card style={{padding:'35px', textAlign: mobile ? 'center' : 'left'}}>

                    <h4>{`Hay ${datos.getLocalStatistics.count} viviendas, ${datos.getLocalStatistics.countNoAbonado} no abonadas. Neto: ${datos.getLocalStatistics.count - datos.getLocalStatistics.countNoAbonado}`} </h4>

                    <br/>

                    <h4> {`Llamadas: ${datos.getLocalStatistics.countContesto + datos.getLocalStatistics.countNoContesto + datos.getLocalStatistics.countNoLlamar + datos.getLocalStatistics.countNoAbonado} (${ Math.round( (datos.getLocalStatistics.countContesto + datos.getLocalStatistics.countNoContesto + datos.getLocalStatistics.countNoLlamar + datos.getLocalStatistics.countNoAbonado) / datos.getLocalStatistics.count * 1000 )/10}%) (Predicadas (sin cartas) + No contestó + No abonadas)`} </h4>

                    <br/>

                    <h4> Libres para llamar: {datos.getLocalStatistics.libres} </h4>

                    <hr />

                    <h4>{`Predicadas: ${datos.getLocalStatistics.countContesto + datos.getLocalStatistics.countNoLlamar + datos.getLocalStatistics.countDejarCarta} viviendas (${Math.round((datos.getLocalStatistics.countContesto + datos.getLocalStatistics.countNoLlamar + datos.getLocalStatistics.countDejarCarta)*10000/datos.getLocalStatistics.count/10)/10}%)`} </h4>
                    
                    <br/>

                    <h4> &nbsp;&nbsp; {`Contestó: ${datos.getLocalStatistics.countContesto} viviendas (${Math.round(datos.getLocalStatistics.countContesto*10000/datos.getLocalStatistics.count/10)/10}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`A dejar carta: ${datos.getLocalStatistics.countDejarCarta} viviendas (${Math.round(datos.getLocalStatistics.countDejarCarta*10000/datos.getLocalStatistics.count/10)/10}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`No llamar: ${datos.getLocalStatistics.countNoLlamar} viviendas (${Math.round(datos.getLocalStatistics.countNoLlamar*10000/datos.getLocalStatistics.count/10)/10}%)`} </h4>

                    <hr/>

                    <h4>{`No contestó: ${datos.getLocalStatistics.countNoContesto} viviendas (${Math.round(datos.getLocalStatistics.countNoContesto*10000/datos.getLocalStatistics.count/10)/10}%)`} </h4>

                </Card>

                <div style={{display:'block', margin:'auto', marginTop:'50px'}}>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={()=>reset(1)}
                    >
                        Limpiar más viejos (más de 6 meses)
                    </Button>
                    <br/>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={()=>reset(2)}
                    >
                        Limpiar todos (menos no abonados)
                    </Button>
                    <br/>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={()=>reset(3)}
                    >
                        Limpiar todos y no abonados de más de 6 meses
                    </Button>
                    <br/>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={()=>reset(4)}
                    >
                        Limpiar absolutamente todos
                    </Button>
                    <br/>
                </div>

            </div>
        :
            <>
                <br/><br/><br/>
                <Loading />
            </>
        }

    </>
    )
}


export default EstadisticasLocalPage
