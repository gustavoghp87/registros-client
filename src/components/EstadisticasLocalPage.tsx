import { useEffect, useState } from 'react'
import { H2 } from './css/css'
import { Card, Button } from 'react-bootstrap'
import { Loading } from './_Loading'
import { useParams } from 'react-router'
import { ReturnBtn } from './_Return'
import { Col0b } from './columns/Col0b'
import { confirmAlert } from 'react-confirm-alert'
import { isMobile } from '../services/functions'
import { resetTerritoryService } from '../services/territoryServices'
import { getLocalStatisticsService } from '../services/statisticsServices'
import { typeParam } from '../models/typesTerritorios'
import { localStatistic } from '../models/statistic'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const EstadisticasLocalPage = (props: any) => {

    const { territorio } = useParams<typeParam>()
    const [datos, setDatos] = useState<localStatistic>()

    const reset = async (option: number): Promise<void> => {
        let message = ""
        if (option === 1) message = "Esta opción resetea los predicados más viejos (más de 6 meses)"
        else if (option === 2) message = "Esta opción resetea predicados (no hace nada con los no abonados)"
        else if (option === 3) message = "Esta opción resetea todos los predicados y, además, los no abonados de más de 6 meses"
        else if (option === 4) message = "Esta opción resetea ABSOLUTAMENTE TODO"
        confirmAlert({
            title: `¿Resetear Territorio ${territorio}?`,
            message,
            buttons: [
                { label: 'Yes', onClick: () => resetNow(option) },
                { label: 'No', onClick: () => {} }
            ]
        })
    }
    
    const resetNow = async (option: number): Promise<void> => {
        const response: boolean = await resetTerritoryService(territorio, option)
        if (response) window.location.reload()
    }

    useEffect(() => {
        (async () => {
            const data: localStatistic|null = await getLocalStatisticsService(territorio)
            if (data && data) setDatos(data)
        })()
    }, [territorio])

    return (
        <>
        {ReturnBtn(props)}
        
        <H2> ESTADÍSTICAS </H2>

        <h1 style={{textAlign:'center', marginBottom: isMobile ? '30px' : '25px'}}>
            TERRITORIO {territorio}
        </h1>

        <Col0b
            territorio={territorio}
            isTodo={false}
            isStatistics={true}
        />

        {datos
        ?
            <div style={{margin: isMobile ? '0' : '0 10%'}}>
                <br/>
                <Card style={{padding:'35px', textAlign: isMobile ? 'center' : 'left'}}>

                    <h4>{`Hay ${datos.count} viviendas, ${datos.countNoAbonado} no abonadas. Neto: ${datos.count - datos.countNoAbonado}`} </h4>

                    <br/>

                    <h4> {`Llamadas: ${datos.countContesto + datos.countNoContesto + datos.countNoLlamar + datos.countNoAbonado} (${ Math.round( (datos.countContesto + datos.countNoContesto + datos.countNoLlamar + datos.countNoAbonado) / datos.count * 1000 )/10}%) (Predicadas (sin cartas) + No contestó + No abonadas)`} </h4>

                    <br/>

                    <h4> Libres para llamar: {datos.libres} </h4>

                    <hr />

                    <h4>{`Predicadas: ${datos.countContesto + datos.countNoLlamar + datos.countDejarCarta} viviendas (${Math.round((datos.countContesto + datos.countNoLlamar + datos.countDejarCarta)*10000/datos.count/10)/10}%)`} </h4>
                    
                    <br/>

                    <h4> &nbsp;&nbsp; {`Contestó: ${datos.countContesto} viviendas (${Math.round(datos.countContesto*10000/datos.count/10)/10}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`A dejar carta: ${datos.countDejarCarta} viviendas (${Math.round(datos.countDejarCarta*10000/datos.count/10)/10}%)`} </h4>

                    <h4> &nbsp;&nbsp; {`No llamar: ${datos.countNoLlamar} viviendas (${Math.round(datos.countNoLlamar*10000/datos.count/10)/10}%)`} </h4>

                    <hr/>

                    <h4>{`No contestó: ${datos.countNoContesto} viviendas (${Math.round(datos.countNoContesto*10000/datos.count/10)/10}%)`} </h4>

                </Card>

                <div style={{display:'block', margin:'auto', marginTop:'50px'}}>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={() => reset(1)}
                    >
                        Limpiar más viejos (más de 6 meses)
                    </Button>
                    <br/>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={() => reset(2)}
                    >
                        Limpiar todos (menos no abonados)
                    </Button>
                    <br/>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={() => reset(3)}
                    >
                        Limpiar todos y no abonados de más de 6 meses
                    </Button>
                    <br/>
                    <Button variant='dark' style={{display:'block', margin:'auto'}}
                        onClick={() => reset(4)}
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
