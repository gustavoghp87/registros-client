import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import { Card, Button, Pagination } from 'react-bootstrap'
import { typeUsers, typeUser } from '../hoc/types'
import { H2 } from './css/css'
import { Loading } from './_Loading'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { mobile } from './_App'


function AdminsPage(props:any) {
    
    const [Usuarios, setUsuarios] = useState<typeUsers>({usuarios: []})
    const [asignVisible, setAsignVisible] = useState(false)
    const [groupVisible, setGroupVisible] = useState(false)
    const [asig, setAsig] = useState<any[]>([])
    const [desasig, setDesasig] = useState<any[]>([])

    const { data } = useQuery(graphql.GETUSERS, {variables:{token:localStorage.getItem('token')}})

    const [controlarU] = useMutation(graphql.CONTROLARUSUARIO)
    const [asignarT] = useMutation(graphql.ASIGNAR)

    const controlar = async (user_id:String, estado:Boolean, role:Number, group:Number) => {
        controlarU({variables: {token:localStorage.getItem('token'), user_id, estado, role, group}})
    }
    const escuchar = useSubscription(graphql.ESCUCHARCAMBIODEUSUARIO)

    const asignar = (user_id:String, all:Boolean) => {
        let asignar, desasignar
        
        if (asig[0]===user_id && asig[1]) asignar = parseInt(asig[1])
        if (desasig[0]===user_id && desasig[1]) desasignar = parseInt(desasig[1])
        if (asignar) asignarT({variables: {token:localStorage.getItem('token'), user_id, asignar}})
        if (desasignar) asignarT({variables: {token:localStorage.getItem('token'), user_id, desasignar}})
        if (all) asignarT({variables: {token:localStorage.getItem('token'), user_id, all}})
        setAsig([])
        setDesasig([])
    }

    
    useEffect(() => {
        if (data) setUsuarios({usuarios: data.getUsers})
        if (escuchar.data) {
            let datos = escuchar.data.escucharCambioDeUsuario
            let nuevoUsuarios:typeUsers = {usuarios: []}
            Usuarios.usuarios.forEach((usuario:typeUser) => {
                if (usuario._id.toString()===datos._id) {
                    nuevoUsuarios.usuarios.push({
                        _id: datos._id,
                        role: datos.role,
                        estado: datos.estado,
                        email: datos.email,
                        group: datos.group,
                        asign: datos.asign
                    })
                } else {
                    nuevoUsuarios.usuarios.push(usuario)
                }
            })
            setUsuarios(nuevoUsuarios)
        }
    }, [data, escuchar.data])
    

    return (
    <>
        {ReturnBtn(props)}

        <H2 style={{fontSize: mobile ? '2.2rem' : ''}}> ADMINISTRADORES </H2>

        <Button variant={'danger'} style={{display:'block', margin:'30px auto 0 auto'}} onClick={()=>window.location.href='/celulares2021'}>
            Ir a Campaña Celulares 2021
        </Button>


        <div style={{display:'block', margin: mobile ? '' : '80px auto'}}>


            {!Usuarios.usuarios.length && <Loading />}


            {Usuarios.usuarios &&
                Usuarios.usuarios.map((usuario:typeUser, index:any) => {
                    
                    let active = usuario.group
                    let items = []
                    for (let number=1; number<=6; number++) {
                      items.push(
                        <Pagination.Item key={number}
                            active={number === active}
                            onClick={() => {
                                controlar(usuario._id.toString(), usuario.estado, usuario.role, number)
                            }}
                        >
                          {number}
                        </Pagination.Item>
                      )
                    }
                    
                    
                return (

                    <Card key={index} 
                        style={{
                            width: mobile ? '332px': '500px',
                            margin:'30px auto 60px auto',
                            backgroundColor:'#f6f6f8'
                        }}>
                        
                        <Card.Body style={{padding:'30px'}}>

                            <Card.Title style={{
                                textAlign:'center',
                                padding:'20px',
                                fontSize: mobile ? '1.5rem' : '1.8rem'
                            }}>
                                Usuario: <br/>
                                {usuario.email}

                            </Card.Title>


                            <hr/>


                            <Card.Text style={{fontWeight:500, fontSize:'1.2rem', textAlign:'center'}}>
                                Territorios asignados: &nbsp;
                                {usuario.asign && !!usuario.asign.length &&
                                    usuario.asign.map((asign:number) => (
                                        <span key={asign} className="d-inline-block">
                                            {asign} &nbsp;
                                        </span>
                                    ))
                                }
                            </Card.Text>


                            <Button block variant="primary"
                                style={{marginTop:'10px'}}
                                onClick={ () => setAsignVisible(!asignVisible) }
                            >
                                CAMBIAR ASIGNACIONES
                            </Button>

                            <div style={{
                                display: asignVisible ? 'block' : 'none',
                                padding:'20px',
                                textAlign:'center'
                            }}>
                                <div style={{marginTop:'12px'}}>
                                    <input type="number" style={{width:'60px'}} min={1}
                                        onChange={ event => 
                                            setAsig([usuario._id.toString(), event.target.value]) }
                                    />
                                    
                                    &nbsp;
                                    
                                    <Button onClick={
                                        () => asignar(usuario._id.toString(), false)
                                    }>
                                        &nbsp; Asignar &nbsp;
                                    </Button>

                                </div>

                                <div style={{marginTop:'12px'}}>
                                    <input type="number" name="" id="" style={{width:'60px'}} min={1}
                                        onChange={ event =>
                                            setDesasig([usuario._id.toString(), event.target.value]) }
                                    />

                                    &nbsp;

                                    <Button onClick={
                                        () => asignar(usuario._id.toString(), false)
                                    }> Desasignar </Button>
                                </div>

                                <div style={{marginTop:'12px'}}>
                                    <Button onClick={
                                        () => asignar(usuario._id.toString(), true)
                                    }> Borrar todos </Button>
                                </div>
                            </div>


                            <hr/>


                            <Card.Text style={{textAlign:'center', fontSize:'1.2rem', fontWeight:600}}>
                                Grupo: {usuario.group} &nbsp;&nbsp;
                                <Button variant="dark" onClick={ () => setGroupVisible(!groupVisible)}>
                                    CAMBIAR GRUPO
                                </Button>
                            </Card.Text>


                            <div style={{width:'350px', margin:'auto'}}>
                                <div style={{display: groupVisible ? 'block' : 'none'}}>

                                    <Pagination size="lg" style={{textAlign:'center'}}>
                                        {items}
                                    </Pagination>

                                </div>
                            </div>
                        

                            <hr/>
                            

                            <Button block variant={usuario.estado ? 'danger' : 'primary'}
                                onClick={() => { usuario.estado === true 
                                    ?
                                    controlar(usuario._id.toString(), false, usuario.role, usuario.group)
                                    :
                                    controlar(usuario._id.toString(), true, usuario.role, usuario.group)
                                }}>
                                
                                {usuario.estado ? "DESACTIVAR" : "ACTIVAR"}
                            
                            </Button>


                            <br/>


                            <Button block variant={usuario.role===1 ? 'danger' : 'primary'}
                                onClick = {
                                    () => { usuario.role === 1 
                                        ?
                                        controlar(usuario._id.toString(), usuario.estado, 0, usuario.group)
                                        :
                                        controlar(usuario._id.toString(), usuario.estado, 1, usuario.group)
                                    }
                                }
                            >

                                {usuario.role===1 ? "QUITAR ADMIN" : "HACER ADMIN"}

                            </Button>


                        </Card.Body>
                    </Card>

                )})
            }
        </div>

    </>
    )
}


export default AdminsPage
