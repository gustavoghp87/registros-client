import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import { Card, Col, Row, SplitButton, Dropdown, Button } from 'react-bootstrap'
import { typeUsers, typeUser, typeCampaign, typePack } from '../hoc/types'
import { colocarGuiones } from '../hoc/functions'
import { H2 } from './css/css'
import { Loading } from './_Loading'
import { useQuery } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { mobile } from './_App'
import { SERVER } from '../config'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'


function CelularesPage(props:any) {

    const [Usuarios, setUsuarios] = useState<typeUsers>({usuarios: []})
    const [Campaign, setCampaign] = useState<typeCampaign>({packs: []})
    const [change, setChange] = useState(false)
    const [showFiltered, setShowFilered] = useState(false)
    const { data } = useQuery(graphql.GETUSERS, {variables: { token:localStorage.getItem('token') } })
    
    useEffect(() => {
        if (data) setUsuarios({ usuarios: data.getUsers })

        ;(async () => {
            const fetchy2 = await fetch(`${SERVER}/api/campaign/getCampaign`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ token: localStorage.getItem('token') })
            })
            const paquetes2 = await fetchy2.json()
            setCampaign({ packs: paquetes2 })
        })()
        setChange(false)

    }, [data, change])

    const submit = (packId: number) => {
        confirmAlert({
          title: '¿Confirmar marcar todos como llamados?',
          message: 'Esta acción no tiene vuelta atrás salvo asignándose el territorio y desmarcando los teléfonos de a uno',
          buttons: [
            {
              label: 'Marcar todos',
              onClick: () => MarkEverythingLikeCalled(packId.toString())
            },
            {
              label: 'Cancelar',
              onClick: () => {}
            }
          ]
        })
    }

    const MarkEverythingLikeCalled = async (packId: string) => {
        console.log("Marcando")
        const response = await fetch(`${SERVER}/api/campaign/finished`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token: localStorage.getItem('token'), packId})
        })
        const data = await response.json()
        console.log(data)
        if (data.success) setChange(true)
    }

    const asignar = async (id:number, email:string) => {
        const fetchy = await fetch(`${SERVER}/api/campaign/asign`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token:localStorage.getItem('token'), id, email })
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

        <Button variant={showFiltered ? 'primary' : 'danger'} style={{display:'block', margin:'30px auto 0 auto'}}
         onClick={() => setShowFilered(!showFiltered)}>
            {showFiltered ? 'Ver todos' : 'Ver solo No Asignados No Terminados'}
        </Button>

        <div style={{display:'block', margin: mobile ? '' : '80px auto'}}>

            {Usuarios && Usuarios.usuarios && !!Usuarios.usuarios.length && Campaign && Campaign.packs && !!Campaign.packs.length &&
                Campaign.packs.map((pack:typePack) => {
                    
                    let filtered = false
                    if (showFiltered && ((pack.asignado && pack.asignado!=="No asignado") || pack.terminado)) filtered = true
                    
                    return (

                    <Card key={pack.id} className={pack.terminado ? "bg-info text-white mb-4" : "bg-dark text-white mb-4"}
                        style={{display: filtered ? 'none' : ''}}
                    >
                        <Card.Body>
                            <Row>
                                <Col md={4} style={{marginBottom: mobile ? '15px' : '', textAlign: mobile ? 'center' : 'left'}}>
                                    <h3> Paquete: {pack.id} </h3>
                                    {/* <h4> Grupo de paquetes: {pack.paquete} </h4> */}
                                    <br/>
                                    <h4> Teléfonos desde: {colocarGuiones(pack.desde)} </h4>
                                    <h4> &nbsp; , hasta: {colocarGuiones(pack.al)} </h4>
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

                                    <br/>
                                    <br/>

                                    <Button variant="secondary" onClick={() => submit(pack.id)} style={{display: pack.terminado ? 'none' : ''}}>
                                        Marcar como terminado
                                    </Button>
                                    
                                </Col>
                                <Col md={4} style={{marginBottom: mobile ? '15px' : '', textAlign: mobile ? 'center' : 'left'}}>
                                    <h4> ¿Terminado? </h4>
                                    <h4> {pack.terminado ? "TERMINADO" : "NO"} </h4>
                                    <h4> Llamados: {pack.terminado ? '50' : pack.llamados ? pack.llamados.length : '0'} </h4>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    )
                })

            }

            {!Usuarios || !Usuarios.usuarios || !Usuarios.usuarios.length && <Loading />}

            {!Campaign || !Campaign.packs || !Campaign.packs.length && <Loading />}

        </div>

    </>
    )
}


export default CelularesPage
