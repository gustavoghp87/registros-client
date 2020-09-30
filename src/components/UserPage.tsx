import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { IUser, IState } from '../types/types'
import { Card, Button } from 'react-bootstrap'
import { ReturnBtn } from './_Return'


function UserPage(props:any) {
    
    const user:IUser = useSelector((state:IState) => state.user.userData)

    const [show, setshow] = useState(false)

    const timeConverter = (UNIX_timestamp:string) => {
        var a = new Date(UNIX_timestamp)
        var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
        var year = a.getFullYear()
        var month = months[a.getMonth()]
        var date = a.getDate()
        var hour = a.getHours()
        var min = a.getMinutes()<10? "0" + a.getMinutes() : a.getMinutes()
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min
        return time;
    }

    
    return (
        <>
        {ReturnBtn(props)}
        <h2 style={{textAlign:'center'}}> Usuario </h2>

        <br/><br/>

        {user &&
            <Card style={{padding:'15px'}}>
                Usuario: {user.email}
                <div className="d-inline-block"> Territorios asignados: &nbsp; &nbsp;
                    {user.asign &&
                        user.asign.map((territorio, index) => (
                            <div key={index} className="d-inline-block"> {territorio} &nbsp; &nbsp; </div>
                        ))
                    }
                </div>

            </Card>
        }
        <br/>

        <div style={{textAlign:'center'}}>
        {user && user.actividad && user.actividad.length &&
            <Button onClick={()=>setshow(!show)} variant="dark">
                {show? "Ocultar actividad" : "Ver actividad"}
            </Button>
        }
        </div>

        <div className="row" style={{paddingTop:'40px', justifyContent:'space-evenly'}}>

            {user && user.actividad &&
                user.actividad.map((actividad, index) => (
                    <Card key={index} style={{display: show? 'block' : 'none', width:'230px', margin:'15px', padding:'15px', backgroundColor:'#b4e999'}} >
                        <h6> {actividad.fechaUlt? timeConverter(actividad.fechaUlt) : ""} </h6>
                        <h5> Territorio {actividad.territorio} {actividad.manzana? `manz ${actividad.manzana}` : ""} </h5>
                        <h5> {actividad.direccion} </h5>
                        <h5> {actividad.telefono} </h5>
                        <h5> {actividad.estado} </h5>
                        <h5> {actividad.noAbonado? "Teléfono no abonado" : ""} </h5>
                    </Card>
                ))
            }
        </div>

        <br/><br/><br/><br/>

            
        </>
    )
};


export default UserPage;
