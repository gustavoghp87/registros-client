import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { typeUser, typeState } from '../hoc/types'
import { Card } from 'react-bootstrap'
import { ReturnBtn } from './_Return'
import { H2 } from './css/css'


function UserPage(props:any) {
    
    const user:typeUser = useSelector((state:typeState) => state.user.userData)
    
    const asignOrdenados = () => {
        let ordenados = [0]
        if (user.asign)
            ordenados = user.asign.sort((a:number, b:number) => a - b)
        return ordenados
    }

    return (
        <>
            {ReturnBtn(props)}

            <H2 style={{textAlign:'center'}}> Usuario </H2>

            {user &&
                <Card style={{padding:'20px'}}>
                    
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

                </Card>
            }
        </>
    )
}


export default UserPage
