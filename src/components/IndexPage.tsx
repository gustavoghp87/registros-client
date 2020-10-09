import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IState, IUser } from '../hoc/types'
import { Loading } from './_Loading'
import { ReturnBtn } from './_Return'
import { H2 } from './css/css'
import { mobile } from './_App'
import { Row } from 'react-bootstrap'


function IndexPage(props:any) {

    const user:IUser = useSelector((state:IState) => state.user.userData)
    const [Territorios, setTerritorios] = useState([0])

    useEffect(() => {
        if (user && user.asign && user.asign.length) {
            let asignados = user.asign
            asignados.sort((a:number, b:number) => a - b)
            setTerritorios(asignados)
        }
    }, [user])

    const btnTerri = {
        width: '120px',
        height: '100px',
        borderRadius: '15px',
        margin: '0 1% 40px 1%',
    }


    return (
        <>
            {ReturnBtn(props)}
        
            <H2> SELECCIONE UN TERRITORIO </H2>


            <div className="container" style={{paddingTop:'0', marginBottom:'50px'}}>

                <Row style={{padding: mobile ? '40px' : '70px 40px', justifyContent:'space-evenly'}}>
                
                    {user && user.isAuth
                    ?
                        Territorios.map((territorio, index) => (
                            <Link type="button" className="btn btn-danger" style={btnTerri}
                            to={`/territorios/${territorio}`} key={index}>
                                <h2 className="h-100 align-middle"
                                style={{padding:'22%', fontFamily:'"Arial Black", Gadget, sans-serif'}}>
                                    {territorio}
                                </h2>
                            </Link>
                        ))
                    :
                        <Loading />
                    }

                </Row>

            </div>
        </>
    )
}


export default IndexPage
