import React, { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import Axios from 'axios'
import { Card, Button} from 'react-bootstrap'
import { IUsers, IUser } from '../types/types'
import { SERVER } from '../config.json'


function AdminsPage(props:any) {

    const [Usuarios, setUsuarios] = useState<any>({usuarios: []})

    useEffect(() => {
        (async () => {
            const axios = await Axios.post(`${SERVER}/api/users/getUsers`, {token:document.cookie})
            console.log(axios); 
            
            setUsuarios({usuarios: axios.data.users})
        })()
    }, [])
    
    
    return (
        <>
            {ReturnBtn(props)}
            <h2 style={{textAlign:'center', marginTop:'40px'}}> Administradores </h2>
            <br/><br/>

            <div style={{display:'block', margin:'auto'}}>
            {Usuarios.usuarios.length &&
                Usuarios.usuarios.map((usuario:any, index:any) => (

                    <Card key={index} style={{width:'25rem', margin:'20px auto'}}>
                        <Card.Body>
                            <Card.Title style={{textAlign:'center'}}> {usuario.email} </Card.Title>
                            <br/>
                            
                            <Card.Text>
                                Territorios asignados: &nbsp;
                                {usuario.asign &&
                                    usuario.asign.map((asign:number) => (
                                        <h6 key={asign} className="d-inline-block"> {asign} &nbsp; </h6>
                                    ))
                                }
                            </Card.Text>

                            <Button block variant="success" style={{marginTop:'10px'}}>
                                Cambiar asignaciones
                            </Button>
                            <br/>
                            
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
