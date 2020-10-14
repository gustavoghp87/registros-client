import React from 'react'
import { H2 } from './css/css'
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { Loading } from './_Loading'
import { mobile } from './_App'
import { useParams } from 'react-router'
import { typeParam } from '../hoc/types'
import { ReturnBtn } from './_Return'
import { Col0b } from './columns/Col0b'


function EstadisticasLocalPage(props:any) {

    const { territorio } = useParams<typeParam>()
    const datos = useQuery(graphql.GETLOCALSTATISTICS,
        {variables: {token:document.cookie, territorio}}
    ).data
    
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

                    <h4>{`Hay ${datos.getLocalStatistics.count} viviendas`} </h4>

                    <br/>

                    <h4>{`Predicadas: ${datos.getLocalStatistics.countContesto + datos.getLocalStatistics.countNoLlamar + datos.getLocalStatistics.countDejarCarta} viviendas (${Math.round((datos.getLocalStatistics.countContesto + datos.getLocalStatistics.countNoLlamar + datos.getLocalStatistics.countDejarCarta)*10000/datos.getLocalStatistics.count)/100}%)`} </h4>
                    
                    <br/>

                    <h4>{`Contestó: ${datos.getLocalStatistics.countContesto} viviendas (${Math.round(datos.getLocalStatistics.countContesto*10000/datos.getLocalStatistics.count)/100}%)`} </h4>

                    <h4>{`No contestó ${datos.getLocalStatistics.countNoContesto} viviendas (${Math.round(datos.getLocalStatistics.countNoContesto*10000/datos.getLocalStatistics.count)/100}%)`} </h4>

                    <h4>{`A dejar carta: ${datos.getLocalStatistics.countDejarCarta} viviendas (${Math.round(datos.getLocalStatistics.countDejarCarta*10000/datos.getLocalStatistics.count)/100}%)`} </h4>

                    <h4>{`No llamar: ${datos.getLocalStatistics.countNoLlamar} viviendas (${Math.round(datos.getLocalStatistics.countNoLlamar*10000/datos.getLocalStatistics.count)/100}%)`} </h4>

                    <br/>

                    <h4>{`No abonados en servicio: ${datos.getLocalStatistics.countNoAbonado} viviendas`} </h4>

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


export default EstadisticasLocalPage
