import { useState } from 'react'
import { useSelector } from 'react-redux'
import { typeUser, typeState } from '../models/typesUsuarios'
import { Card, Button, Form } from 'react-bootstrap'
import { ReturnBtn } from './_Return'
import { H2 } from './css/css'
import { changePswService } from '../services/userServices'
import { isMobile } from '../services/functions'

export const UserPage = (props: any) => {
    
    const user:typeUser = useSelector((state:typeState) => state.user.userData)
    const [show, setShow] = useState(false)
    const [psw, setPsw] = useState('')
    const [newPsw, setNewPsw] = useState('')
    
    const asignOrdenados = () => {
        let ordenados = [0]
        if (user.asign)
            ordenados = user.asign.sort((a:number, b:number) => a - b)
        return ordenados
    }

    const changePsw = async () => {
        setPsw('')
        setNewPsw('')
        alert("Cambiando password de " + psw + " a " + newPsw)
        const response: any|null = await changePswService(psw, newPsw)
        if (response && response.success) { alert("Clave cambiada con éxito") }
        else if (response && response.compareProblem) alert("Clave incorrecta")
        else alert("Algo falló")
    }


    return (
        <>
            {ReturnBtn(props)}

            <H2 style={{textAlign:'center'}}> Usuario </H2>

            {user &&
            <>
                <Card style={{padding:'25px', margin:'30px auto'}}>
                    
                    {isMobile ?
                    <>
                        <h4> Usuario: {user.email} </h4>
                        <br/>

                        <div className="d-inline-block">
                            <h4 className="d-inline-block"> Territorios asignados: &nbsp; &nbsp; </h4>

                            {user.asign &&
                                asignOrdenados().map((territorio:number, index:number) => (
                                    <h4 key={index} className="d-inline-block">
                                        {territorio} &nbsp; &nbsp;
                                    </h4>
                                ))
                            }

                        </div>
                    </>
                    :
                    <>
                        <h3> Usuario: {user.email} </h3>
                        
                        <div className="d-inline-block">
                            <h3 className="d-inline-block"> Territorios asignados: &nbsp; &nbsp; </h3>

                            {user.asign &&
                                asignOrdenados().map((territorio:number, index:number) => (
                                    <h3 key={index} className="d-inline-block">
                                        {territorio} &nbsp; &nbsp;
                                    </h3>
                                ))
                            }

                        </div>
                    </>
                    }

                    <Button
                        variant={"danger"}
                        style={{display: show ? 'none' : 'block', maxWidth:'400px', margin:'20px auto 0 auto'}}
                        onClick={() => setShow(true)}>
                        Cambiar contraseña
                    </Button>

                </Card>

                {show &&
                    <Card style={{padding:'25px', margin:'60px auto', maxWidth:'600px'}}>
                        <Card.Title className="mb-4"> CAMBIAR CONTRASEÑA </Card.Title>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label> Contraseña actual </Form.Label>
                            <Form.Control type="text" placeholder="Contraseña actual" value={psw} onChange={(event)=>setPsw(event.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label> Nueva contraseña </Form.Label>
                            <Form.Control type="text" placeholder="Nueva contraseña" value={newPsw} onChange={(event)=>setNewPsw(event.target.value)} />
                        </Form.Group>

                        <Button variant="primary" className="mt-4 mb-2" type="submit" onClick={()=>changePsw()}>
                            Aceptar
                        </Button>

                        <Button variant="danger" type="cancel" onClick={()=>setShow(false)}>
                            Cancelar
                        </Button>
                    </Card>
                }
                
                {/* <Button variant={darkMode ? "dark" : "danger"} onClick={()=>changeMode()}> {darkMode ? "Modo claro" : "Modo oscuro"} </Button> */}

            </>
            }
        </>
    )
}
