import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import { Card, Col, Row, SplitButton, Dropdown } from 'react-bootstrap'
import { typeUsers, typeUser, typeCampaign, typePack } from '../hoc/types'
import { colocarGuiones } from '../hoc/functions'
import { H2 } from './css/css'
import { Loading } from './_Loading'
import { useQuery } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { mobile } from './_App'
import { SERVER } from '../config'


function CelularesPage(props:any) {

    const [Usuarios, setUsuarios] = useState<typeUsers>({usuarios: []})
    const [Campaign, setCampaign] = useState<typeCampaign>({packs: []})
    const [change, setChange] = useState(false)

    const { data } = useQuery(graphql.GETUSERS, {variables:{token:document.cookie}})

    
    useEffect(() => {
        if (data) setUsuarios({usuarios:data.getUsers})

        ;(async () => {
            const fetchy2 = await fetch(`${SERVER}/api/campaign/getCampaign`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token:document.cookie})
            })
            const paquetes2 = await fetchy2.json()
            setCampaign({packs:paquetes2})
        })()
        setChange(false)

    }, [data, change])


    const asignar = async (id:number, email:string) => {
        const fetchy = await fetch(`${SERVER}/api/campaign/asign`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token:document.cookie, id, email})
        })
        const resp = await fetchy.json()
        if (resp.success && email!=='Nadie') alert(`Asignado con éxito ${email} a ${id}`)
        else if (resp.success && email==='Nadie') alert(`Desasignado ${id} con éxito`)
        else alert("Algo falló")
        setChange(true)
    }
    

    return (
    <>
        {ReturnBtn(props)}

        <H2 style={{fontSize: mobile ? '2.2rem' : '', marginBottom: mobile ? '20px' : ''}}> CAMPAÑA CELULARES 2021 </H2>


        <div style={{display:'block', margin: mobile ? '' : '80px auto'}}>


            {Usuarios && !!Usuarios.usuarios.length && !!Campaign.packs.length &&
                Campaign.packs.map((pack:typePack) => (

                    <Card key={pack.id} className={pack.terminado ? "bg-info text-white mb-4" : "bg-dark text-white mb-4"}>
                        <Card.Body>
                            <Row>
                                <Col md={4} style={{marginBottom: mobile ? '15px' : '', textAlign: mobile ? 'center' : 'left'}}>
                                    <h3> Paquete: {pack.id} </h3>
                                    <h4> Grupo de paquetes: {pack.paquete} </h4>
                                    <h4> Teléfonos desde: {colocarGuiones(pack.desde)} </h4>
                                    <h4> , hasta: {colocarGuiones(pack.al)} </h4>
                                </Col>
                                <Col md={4} style={{marginBottom: mobile ? '15px' : '', textAlign: mobile ? 'center' : 'left'}}>
                                    <h4> Asignado a: </h4>

                                    <SplitButton id={`1`} variant={(!pack.asignado || pack.asignado==="No asignado") ? 'primary' : 'danger'}
                                     title={pack.asignado ? pack.asignado : "No asignado"}>
                                        
                                        {Usuarios.usuarios.map((user:typeUser, index:number) => (
                                            <Dropdown.Item key={index} eventKey={index.toString()} onClick={()=>asignar(pack.id, user.email)}>
                                                {user.email}
                                            </Dropdown.Item>
                                        ))}
                                        
                                        <Dropdown.Divider />
                                        
                                        <Dropdown.Item key={0} eventKey={'0'} onClick={()=>asignar(pack.id, 'Nadie')}>
                                            Nadie
                                        </Dropdown.Item>

                                    </SplitButton>

                                </Col>
                                <Col md={4} style={{marginBottom: mobile ? '15px' : '', textAlign: mobile ? 'center' : 'left'}}>
                                    <h4> ¿Terminado? </h4>
                                    <h4> {pack.terminado ? "TERMINADO" : "NO"} </h4>
                                    <h4> Llamados: {pack.llamados ? pack.llamados.length : '0'} </h4>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))

            }

            {!Usuarios.usuarios.length && <Loading />}

            {!Campaign.packs.length && <Loading />}

        </div>

    </>
    )
}


export default CelularesPage