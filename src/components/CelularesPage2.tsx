import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import { Card, Col, Row, Button } from 'react-bootstrap'
import { typePack, typeParam } from '../hoc/types'
import { colocarGuiones } from '../hoc/functions'
import { H2 } from './css/css'
import { Loading } from './_Loading'
import { mobile } from './_App'
import { SERVER } from '../config'
import { useParams } from 'react-router'


function CelularesPage2(props:any) {

    const { id } = useParams<typeParam>()
    const [paquete, setPaquete] = useState<typePack>()
    const [telefonos, setTelefonos] = useState<any>([])
    const [change, setChange] = useState(false)
    
    useEffect(() => {
        ;(async () => {
            const fetchy = await fetch(`${SERVER}/api/campaign/getPack`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            })
            const pack:typePack = await fetchy.json()
            console.log(pack) 
            setPaquete(pack)
            let tel = []
            let i:number = 0
            while (i<50) {
                tel.push(pack.desde+i)
                i++
            }
            console.log(tel)
            setTelefonos(tel)
        })()
        setChange(false)
    }, [change])


    const clickBox = async (tel:number, checked:boolean) => {
        console.log(`Click en teléfono ${tel}, está en ${checked}`);
        const fetchy = await fetch(`${SERVER}/api/campaign/clickBox`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token:document.cookie, tel, id:parseInt(id), checked})
        })
        const resp = await fetchy.json()
        if (resp.success) {console.log(`Click en teléfono ${tel}, queda en ${!checked}`); setChange(true)}
        else alert("Hubo un error")
    }


    return (
    <>
        {ReturnBtn(props)}

        <H2 style={{fontSize: mobile ? '2.2rem' : '', marginBottom: mobile ? '20px' : ''}}> CAMPAÑA CELULARES 2021 </H2>

        <h1 style={{textAlign:'center', marginBottom: mobile ? '20px' : ''}}> Paquete de teléfonos {id} </h1>


        <div style={{display:'block', margin: mobile ? '' : '80px auto'}}>

            <Row>
                <Col lg={4} sm={6}>
                    {telefonos && !!telefonos.length && telefonos.map((tel:number, index:number) => (
                        <div key={index}>
                            <Card.Body style={{display: index<17 ? '' : 'none'}}>
                                <h5 style={{display:'inline', fontSize:'2rem'}}>
                                    <a href={`tel:${tel}`}> {colocarGuiones(tel)} &nbsp; </a>
                                </h5>
                                <input style={{display:'inline'}} type="checkbox"
                                    checked={(paquete && paquete.llamados && paquete.llamados.includes(tel)) ? true : false}
                                    onChange={()=> clickBox(tel, paquete && paquete.llamados && paquete.llamados.includes(tel) ? true : false)}
                                />
                            </Card.Body>
                        </div>
                    ))}
                </Col>
                <Col lg={4} sm={6}>
                    {telefonos && !!telefonos.length && telefonos.map((tel:number, index:number) => (
                        <div key={index}>
                            <Card.Body style={{display: (index>16 && index<34) ? '' : 'none'}}>
                                <h5 style={{display:'inline', fontSize:'2rem'}}>
                                    <a href={`tel:${tel}`}> {colocarGuiones(tel)} &nbsp; </a>
                                </h5>
                                <input style={{display:'inline'}} type="checkbox"
                                    checked={(paquete && paquete.llamados && paquete.llamados.includes(tel)) ? true : false}
                                    onChange={()=> clickBox(tel, paquete && paquete.llamados && paquete.llamados.includes(tel) ? true : false)}
                                />
                            </Card.Body>
                        </div>
                    ))}
                </Col>
                <Col lg={4} sm={6}>
                    {telefonos && !!telefonos.length && telefonos.map((tel:number, index:number) => (
                        <div key={index}>
                            <Card.Body style={{display: index>33 ? '' : 'none'}}>
                                <h5 style={{display:'inline', fontSize:'2rem'}}>
                                    <a href={`tel:${tel}`}> {colocarGuiones(tel)} &nbsp; </a>
                                </h5>
                                <input style={{display:'inline'}} type="checkbox"
                                    checked={(paquete && paquete.llamados && paquete.llamados.includes(tel)) ? true : false}
                                    onChange={()=> clickBox(tel, paquete && paquete.llamados && paquete.llamados.includes(tel) ? true : false)}
                                />
                            </Card.Body>
                        </div>
                    ))}
                </Col>
            </Row>


            
            {!paquete
            ?
                <Loading />
            :
                <Button variant={'danger'} style={{display:'block', margin:'50px auto 0 auto'}} onClick={()=>console.log("Cambiar todo")}>
                    Marcar todos como llamados (próximamente)
                </Button>
            }

        </div>

    </>
    )
}


export default CelularesPage2
