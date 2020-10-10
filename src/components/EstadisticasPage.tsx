import React from 'react';
import { H2 } from './css/css'
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { Loading } from './_Loading'
import { mobile } from './_App'


function EstadisticasPage() {

    const datos = useQuery(graphql.GETSTATISTICS, {variables: {token:document.cookie}}).data
    if (datos) console.log("Llegó", datos);
    

    return (
        <>
        <H2> ESTADÍSTICAS </H2>

        {datos
        ?
            <div style={{margin: mobile ? '0' : '0 10%'}}>
                <br/>
                <br/>
                <Card style={{padding:'35px', textAlign: mobile ? 'center' : 'left'}}>

                    <h4>{`Hay ${datos.getGlobalStatistics.count} viviendas`} </h4>

                    <br/>

                    <h4>{`Contestó: ${datos.getGlobalStatistics.countContesto} viviendas (${Math.round(datos.getGlobalStatistics.countContesto*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <h4>{`No contestó ${datos.getGlobalStatistics.countNoContesto} viviendas (${Math.round(datos.getGlobalStatistics.countNoContesto*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <h4>{`A dejar carta: ${datos.getGlobalStatistics.countDejarCarta} viviendas (${Math.round(datos.getGlobalStatistics.countDejarCarta*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <h4>{`No llamar: ${datos.getGlobalStatistics.countNoLlamar} viviendas (${Math.round(datos.getGlobalStatistics.countNoLlamar*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

                    <br/>

                    <h4>{`No abonados en servicio: ${datos.getGlobalStatistics.countNoAbonado} viviendas`} </h4>

                </Card>
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


export default EstadisticasPage
