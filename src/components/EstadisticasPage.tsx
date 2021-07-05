import { useState } from 'react'
import { H2 } from './css/css'
import { Card, Button } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import * as graphql from '../services/graphql'
import { Loading } from './_Loading'
import { mobile } from './_App'
import { ReturnBtn } from './_Return'
import { SERVER } from '../config'
import { localStatistic } from '../models/statistic'
import { getToken } from '../services/getToken'
import { getStateOfTerritories } from '../services/stateOfterritories'
import { useEffect } from 'react'


function EstadisticasPage(props:any) {

    const datos = useQuery(graphql.GETSTATISTICS, {variables: { token: getToken() }}).data
    const [localStatistics, setLocalStatistics] = useState<localStatistic[]|null>()
    const [loading, setLoading] = useState(false)
    const [showBtn, setShowBtn] = useState(true)
    const [states, setStates] = useState<any>()

    const retrieveLocalStats = () => {
        let tempArray: localStatistic[] = []
        let counter = 1
        while (counter<57) {
            (async () => {
                const response = await fetch(`${SERVER}/api/statistics`, {
                    method: 'POST',
                    headers: {'Content-Type':'Application/json'},
                    body: JSON.stringify({ token: getToken(), territorio: counter.toString() })
                })
                const data:localStatistic = await response.json()
                if (data) {tempArray.push(data); console.log("Llegó", data.territorio)}
                tempArray.sort((a:localStatistic, b:localStatistic) => parseInt(a.territorio) - parseInt(b.territorio))
                if (tempArray.length===56) { setLocalStatistics(tempArray); setLoading(false) }
            })()
            if (counter === 50) (async () => {
                const states1 = await getStateOfTerritories()
                setStates(states1)
            })()
            counter++
        }
    }


    return (
    <>
        {ReturnBtn(props)}
        <H2> ESTADÍSTICAS GLOBALES </H2>

        {datos
        ?
            <div style={{margin: mobile ? '0' : '0 10%'}}>
                <br/>
                <br/>
                <Card style={{padding:'35px', textAlign: mobile ? 'center' : 'left'}}>

                    <h4>{`Hay ${datos.getGlobalStatistics.count} viviendas, ${datos.getGlobalStatistics.countNoAbonado} no abonadas. Neto: ${datos.getGlobalStatistics.count - datos.getGlobalStatistics.countNoAbonado}`} </h4>

                    <br/>

                    <h4>Llamadas: {datos.getGlobalStatistics.countContesto + datos.getGlobalStatistics.countNoContesto + datos.getGlobalStatistics.countNoLlamar + datos.getGlobalStatistics.countNoAbonado} ({ Math.round( (datos.getGlobalStatistics.countContesto + datos.getGlobalStatistics.countNoContesto + datos.getGlobalStatistics.countNoLlamar + datos.getGlobalStatistics.countNoAbonado) / datos.getGlobalStatistics.count * 1000 )/10}%) (Predicadas (sin cartas) + No contestó + No abonadas) </h4>

                    <br/>

                    <h4>Libres para llamar: {datos.getGlobalStatistics.libres} </h4>

                    <hr/>

                    <h4>{`Predicadas: ${datos.getGlobalStatistics.countContesto + datos.getGlobalStatistics.countNoLlamar + datos.getGlobalStatistics.countDejarCarta} viviendas (${Math.round((datos.getGlobalStatistics.countContesto + datos.getGlobalStatistics.countNoLlamar + datos.getGlobalStatistics.countDejarCarta)*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <br/>

                    <h4> &nbsp;&nbsp; {`Contestó: ${datos.getGlobalStatistics.countContesto} viviendas (${Math.round(datos.getGlobalStatistics.countContesto*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`A dejar carta: ${datos.getGlobalStatistics.countDejarCarta} viviendas (${Math.round(datos.getGlobalStatistics.countDejarCarta*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`No llamar: ${datos.getGlobalStatistics.countNoLlamar} viviendas (${Math.round(datos.getGlobalStatistics.countNoLlamar*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <br/>

                    <h4>{`No contestó: ${datos.getGlobalStatistics.countNoContesto} viviendas (${Math.round(datos.getGlobalStatistics.countNoContesto*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                </Card>

            </div>
        :
            <>
                <br/><br/><br/>
                <Loading />
            </>
        }

        <br/>
        <br/>

        
        <Button variant="primary" className={showBtn ? 'd-block m-auto' : "d-none"}
         onClick={()=>{setLoading(true); setShowBtn(false); retrieveLocalStats();}}>
            Traer Estadísticas por Territorio
        </Button>

        {localStatistics && !!localStatistics.length &&
            localStatistics.map((territory:localStatistic, index:number) => {
                let terminado = false
                if (states) states.forEach((state:any) => {
                    if (state.territorio == territory.territorio) terminado = state.estado                    
                })
                return (
                    <a key={index} href={`/estadisticas/${territory.territorio}`}>
                        <Card
                            style = {{
                                padding:'35px', textAlign: mobile ? 'center' : 'left',
                                display: 'block', margin: 'auto', color: 'black',
                                maxWidth: mobile ? '80%' : '55%', marginBottom:'20px',
                                backgroundColor: territory.libres < 50 ? 'red' : (territory.libres < 100 ? 'yellow': 'green')
                            }}
                            className={terminado ? 'animate-me' : ''}
                        >
                            <h3> Territorio {territory.territorio} {terminado ? '- TERMINADO' : ''} </h3>
                            <h4> Quedan {territory.libres} para predicar </h4>
                        </Card>
                    </a>
                )
            })
        }
        
        {loading ?
            <>
                <br/><br/><br/>
                <Loading />
                <br/>
                <h4 style={{textAlign:'center'}}> Esto demora 10 segundos </h4>
            </>
            :
            <></>
        }

    </>
    )
}


export default EstadisticasPage
