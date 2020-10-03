import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import Axios from 'axios'
import { Card, Button} from 'react-bootstrap'
//import { IUsers, IUser } from '../types/types'
import { SERVER } from '../config.json'
import { H2 } from './css/css'
import { Loading } from './_Loading'


function AdminsPage(props:any) {

    const [Usuarios, setUsuarios] = useState<any>({usuarios: []})

    useEffect(() => {
        (async () => {
            const axios = await Axios.post(`${SERVER}/api/users/getUsers`, {token:document.cookie})
            setUsuarios({usuarios: axios.data.users})
        })()
    }, [])
    
    
    return (
        <>
            {ReturnBtn(props)}
            <H2> ADMINISTRADORES </H2>
            <br/><br/>

            <div style={{display:'block', margin:'auto'}}>

            {!Usuarios.usuarios.length && <Loading />}

            {Usuarios.usuarios &&
                Usuarios.usuarios.map((usuario:any, index:any) => (

                    <Card key={index} style={{width:'25rem', margin:'30px auto 60px auto'}}>
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
                            
                            <Button block variant={usuario.estado==="activado" ? 'danger' : 'primary'}>
                                {usuario.estado==="activado" ? "DESACTIVAR" : "ACTIVAR"}
                            </Button>
                            <br/>

                            <Button block variant={usuario.role===1 ? 'danger' : 'primary'}>
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
