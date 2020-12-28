import React, { useState, useEffect } from 'react'
import { H2 } from './css/css'
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { Loading } from './_Loading'
import { mobile } from './_App'
import { ReturnBtn } from './_Return'
import { SERVER } from '../config'


function EstadisticasPage(props:any) {

    const [localStatistics, setLocalStatistics] = useState<any>({localData:[]})
    const datos = useQuery(graphql.GETSTATISTICS, {variables: {token:document.cookie}}).data
    
    // const datos2 = useQuery(graphql.GETLOCALSTATISTICS,
    //     {variables: {token:document.cookie, territorio:counter.toString()}}
    // ).data

    let arreglo:any = []
    let counter:number = 1
        
    useEffect(() => {
        while (counter<57) {            
            fetch(`${SERVER}/api/statistics`, {
                method: 'POST',
                headers: {'Content-Type':'Application/json'},
                body: JSON.stringify({token:document.cookie, territorio:counter.toString()})
            }).then(datos2 => datos2.json()).then(datos2 => {
                //console.log(datos2, typeof datos2)
                const valor = datos2
                arreglo.push(valor)
                //console.log("ARREGLO:", arreglo)
                arreglo.sort((a:any, b:any) => {
                    return parseInt(a.territorio) - parseInt(b.territorio)
                })
            })
            counter++
        }
        console.log("Arreglo final", arreglo)
        let i = 1
        const writeNext = () => {
            console.log(i)
            i++
            if (i===20) {setLocalStatistics({localData: arreglo}); return}
            setTimeout(() => writeNext(), 1000)
        }
        writeNext()
    }, [])

//    console.log(localStatistics.localData)
    

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

                    <h4>{`Hay ${datos.getGlobalStatistics.count} viviendas`} </h4>

                    <br/>

                    <h4>{`Predicadas: ${datos.getGlobalStatistics.countContesto + datos.getGlobalStatistics.countNoLlamar + datos.getGlobalStatistics.countDejarCarta} viviendas (${Math.round((datos.getGlobalStatistics.countContesto + datos.getGlobalStatistics.countNoLlamar + datos.getGlobalStatistics.countDejarCarta)*10000/datos.getGlobalStatistics.count)/100}%)`} </h4>

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

        <br/>
        <br/>

        {localStatistics && localStatistics.localData && !!localStatistics.localData.length
        ?
            localStatistics.localData.map((territory:any, index:number) =>
                <a key={index} href={`/estadisticas/${territory.territorio}`}
                >
                    <Card style={{
                        padding:'35px', textAlign: mobile ? 'center' : 'left',
                        display: 'block', margin: 'auto', color: 'black',
                        maxWidth: mobile ? '80%' : '55%', marginBottom:'20px',
                        backgroundColor: territory.libres < 50 ? 'red' : (
                            territory.libres < 100 ? 'yellow': 'green')
                    }}>
                        <h3> Territorio {territory.territorio} </h3>
                        <h4> Quedan {territory.libres} para predicar </h4>
                    </Card>
                </a>
            )
        :
            <>
                <br/><br/><br/>
                <Loading />
                <br/>
                <h4 style={{textAlign:'center'}}> Esto demora 20 segundos </h4>
            </>
        }

    </>
    )
}


export default EstadisticasPage
