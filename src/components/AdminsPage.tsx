import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
//import Axios from 'axios'
import { Card, Button} from 'react-bootstrap'
//import { IUsers, IUser } from '../types/types'
//import { SERVER } from '../config.json'
import { H2 } from './css/css'
import { Loading } from './_Loading'
import { useQuery, useMutation } from '@apollo/client'
import * as graphql from '../hoc/graphql'


function AdminsPage(props:any) {
    
    const [Usuarios, setUsuarios] = useState<any>({usuarios: []})

    const [change, setChange] = useState(false)
    const { loading, error, data } = useQuery(graphql.GETUSERS, {
        variables: {token:document.cookie}
    })
    if (loading) console.log("Loading graphql", loading)
    if (error) console.log("Error graphql")
    
    
    const [activarUsuario] = useMutation(graphql.activar)
    const dato = useMutation(graphql.activar)[1]
    const [desactivarUsuario] = useMutation(graphql.desactivar)
    const [hacerAdmin] = useMutation(graphql.hacerAdmin)
    const [deshacerAdmin] = useMutation(graphql.deshacerAdmin)

    console.log(dato);
    

    const activar = (_id:string) => {
        console.log("Activando a", _id);
        activarUsuario({ variables: {user_id:_id, token:document.cookie} })
        if (activarUsuario) console.log("Activando usuario...", activarUsuario)
        setChange(true)
    }

    const desactivar = (_id:string) => {
        console.log("Desactivando a", _id);
        desactivarUsuario({ variables: {user_id:_id, token:document.cookie} })
        if (desactivarUsuario) console.log("Desactivando usuario...", desactivarUsuario)
        setChange(true)
    }

    const hacer = (_id:string) => {
        console.log("Haciendo admin a", _id);
        hacerAdmin({ variables: {user_id:_id, token:document.cookie} })
        setChange(true)
    }
    
    const deshacer = (_id:string) => {
        console.log("Deshaciendo admin a", _id);
        deshacerAdmin({ variables: {user_id:_id, token:document.cookie} })
        setChange(true)
    }
    
    
    useEffect(() => {
        if (data) setUsuarios({usuarios: data.getUsers})
        if (change) window.location.reload()
        setChange(false)
    }, [data, change])
    
    console.log(change);
    

    return (
        <>
            {ReturnBtn(props)}
            <H2> ADMINISTRADORES </H2>
            <br/><br/>

            <div style={{display:'block', margin:'auto'}}>

            {!Usuarios.usuarios.length && <Loading />}

            {Usuarios.usuarios &&
                Usuarios.usuarios.map((usuario:any, index:any) => (

                    <Card key={index} style={{width:'25rem', margin:'30px auto 60px auto', backgroundColor:'#f6f6f8'}}>
                        <Card.Body>
                            <Card.Title style={{textAlign:'center'}}> {usuario.email} </Card.Title>
                            <br/>

                            <Card.Text style={{textAlign:'center', fontSize:'1.2rem', fontWeight:600}}>
                                Grupo: {usuario.group} &nbsp;
                                <Button variant="success" style={{}}>
                                    CAMBIAR GRUPO
                                </Button>
                            </Card.Text>

                            <hr/>
                        
                            <Card.Text style={{fontWeight:500, fontSize:'1.2rem', textAlign:'center'}}>
                                Territorios asignados: &nbsp;
                                {usuario.asign &&
                                    usuario.asign.map((asign:number) => (
                                        <span key={asign} className="d-inline-block"> {asign} &nbsp; </span>
                                    ))
                                }
                            </Card.Text>

                            <Button block variant="success" style={{marginTop:'10px'}}>
                                Cambiar asignaciones
                            </Button>
                            <hr/>
                            
                            <Button block variant={usuario.estado==="activado" ? 'danger' : 'primary'}
                                onClick={()=>{usuario.estado==='activado' ? desactivar(usuario._id) : activar(usuario._id)}}>
                                
                                {usuario.estado==="activado" ? "DESACTIVAR" : "ACTIVAR"}
                            
                            </Button>
                            <br/>

                            <Button block variant={usuario.role===1 ? 'danger' : 'primary'}
                                onClick={()=>{usuario.role===1 ? deshacer(usuario._id) : hacer(usuario._id)}}>

                                {usuario.role===1 ? "QUITAR ADMIN" : "HACER ADMIN"}

                            </Button>

                        </Card.Body>
                    </Card>

                ))
            }
            </div>

        </>
    )
}


export default AdminsPage
