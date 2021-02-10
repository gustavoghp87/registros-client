import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { typeState, typeUser, typeCampaign, typePack } from '../hoc/types'
import { Loading } from './_Loading'
import { ReturnBtn } from './_Return'
import { H2 } from './css/css'
import { mobile } from './_App'
import { Row } from 'react-bootstrap'
import { SERVER } from '../config'


function IndexPage(props:any) {

    const user:typeUser = useSelector((state:typeState) => state.user.userData)
    const [Territorios, setTerritorios] = useState([0])

    const [Campaign, setCampaign] = useState<typeCampaign>({packs: []})

    useEffect(() => {
        if (user && user.asign && user.asign.length) {
            let asignados = user.asign
            asignados.sort((a:number, b:number) => a - b)
            setTerritorios(asignados)
        }
        ;(async () => {
            const fetchy2 = await fetch(`${SERVER}/api/campaign/getCampaign`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token:localStorage.getItem('token')})
            })
            const paquetes2 = await fetchy2.json()
            setCampaign({packs:paquetes2})
        })()
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

                <Row style={{padding: mobile ? '40px' : '70px 40px 0px 40px', justifyContent:'space-evenly'}}>

                    {user && user.isAuth && user.group 
                    ?
                        Territorios.map((territorio, index) => {
                            if (territorio) {return (
                                <Link type="button" className="btn btn-danger" style={btnTerri}
                                    to={`/territorios/${territorio}/1`} key={index}>

                                    <h2 className="h-100 align-middle" style={{
                                        padding: '22%',
                                        margin: 'auto',
                                        fontFamily: '"Arial Black", Gadget, sans-serif',
                                        fontSize: mobile ? '2.3rem' : ''
                                    }}>
                                        {territorio}
                                    </h2>

                                </Link>
                            )} else {
                                return <h3 key={index} style={{marginBottom:'40px'}}>
                                    {/* No hay territorios asignados <br/> Hablar con el grupo de territorios */}
                                </h3>
                            }
                        })
                    :
                        <Loading />
                    }

                </Row>


                {Campaign && !!Campaign.packs.length &&
                <>
                
                    <hr style={{border: '2px solid lightgray', borderRadius:'5px'}}/>

                    <H2> CAMPAÑA CELULARES 2021 </H2>

                    <Row style={{padding: mobile ? '40px' : '70px 40px 0px 40px', justifyContent:'space-evenly'}}>
                    
                        {Campaign.packs.map((pack:typePack, index:number) => (

                            <Link type="button" className="btn btn-success" style={{width:'120px', height:'100px', borderRadius:'15px',
                                margin: '0 1% 40px 1%', display: pack.asignado===user.email ? 'block' : 'none'}}
                                to={`/celulares/${pack.id?.toString()}`} key={index}>

                                <h2 className="h-100 align-middle" style={{
                                    padding: '22%',
                                    margin: 'auto',
                                    fontFamily: '"Arial Black", Gadget, sans-serif',
                                    fontSize: mobile ? '2.3rem' : ''
                                }}>
                                    {pack.id}
                                </h2>

                            </Link>
                        ))}

                    </Row>
                </>
                }

            </div>
        </>
    )
}


export default IndexPage
