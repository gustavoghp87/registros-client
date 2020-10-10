import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import { Card, Button, Pagination } from 'react-bootstrap'
import { typeUsers, typeUser } from '../hoc/types'
import { H2 } from './css/css'
import { Loading } from './_Loading'
import { useQuery, useMutation } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { mobile } from './_App'


function AdminsPage(props:any) {
    
    const [Usuarios, setUsuarios] = useState<typeUsers>({usuarios: []})
    const [asignVisible, setAsignVisible] = useState(false)
    const [groupVisible, setGroupVisible] = useState(false)
    const [result, setResult] = useState<any>({data:''})

    const { data } = useQuery(graphql.GETUSERS, {variables:{token:document.cookie}})
    
    const [controlarU] = useMutation(graphql.CONTROLARUSUARIO)

    const controlar = async (user_id:String, estado:Boolean, role:Number, group:Number) => {
        controlarU(
            {variables: {token:document.cookie, user_id, estado, role, group}}
        ).then(result => setResult({data: result}))
    }
    
    
    useEffect(() => {
        if (data) setUsuarios({usuarios: data.getUsers})
        if (result.data) {
            let datos = result.data
            console.log(datos)
            let nuevoUsuarios:typeUsers = {usuarios: []}
            Usuarios.usuarios.forEach((usuario:typeUser) => {
                if (usuario._id.toString()===datos._id) {
                    nuevoUsuarios.usuarios.push({
                        _id: datos._id,
                        role: datos.role,
                        estado: datos.estado,
                        email: datos.email,
                        group: datos.group
                    })
                } else {
                    nuevoUsuarios.usuarios.push({
                        _id: usuario._id,
                        role: usuario.role,
                        estado: usuario.estado,
                        email: usuario.email,
                        group: usuario.group
                    })
                }
            })
            setUsuarios(nuevoUsuarios)
            console.log("NU", nuevoUsuarios)
        }
    }, [data, result.data])
    

    return (
        <>
            {ReturnBtn(props)}

            <H2> ADMINISTRADORES </H2>


            <div style={{display:'block', margin: mobile ? '' : 'auto'}}>


            {!Usuarios.usuarios.length && <Loading />}


            {Usuarios.usuarios &&
                Usuarios.usuarios.map((usuario:typeUser, index:any) => {
                    
                    let active = usuario.group
                    console.log("active", active)
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
                            width:'25rem',
                            margin:'30px auto 60px auto',
                            backgroundColor:'#f6f6f8'
                        }}>
                        
                        <Card.Body>

                            <Card.Title style={{textAlign:'center'}}>
                                {usuario.email} {usuario._id}
                            </Card.Title>


                            <br/>


                            <Card.Text style={{textAlign:'center', fontSize:'1.2rem', fontWeight:600}}>
                                Grupo: {usuario.group} &nbsp;
                                <Button variant="primary" onClick={ () => setGroupVisible(!groupVisible)}>
                                    CAMBIAR GRUPO
                                </Button>
                            </Card.Text>


                            <div style={{display: groupVisible ? 'block' : 'none'}}>

                                <Pagination size="lg"> {items} </Pagination>

                            </div>


                            <hr/>
                        

                            <Card.Text style={{fontWeight:500, fontSize:'1.2rem', textAlign:'center'}}>
                                Territorios asignados: &nbsp;
                                {usuario.asign &&
                                    usuario.asign.map((asign:number) => (
                                        <span key={asign} className="d-inline-block">
                                            {asign} &nbsp;
                                        </span>
                                    ))
                                }
                            </Card.Text>


                            <Button block variant="success"
                                style={{marginTop:'10px'}}
                                onClick={ () => setAsignVisible(!asignVisible) }
                            >
                                Cambiar asignaciones
                            </Button>

                            <Card style={{display: asignVisible ? 'block' : 'none'}}>
                                tarjeta
                            </Card>


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
