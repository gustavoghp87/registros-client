import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loading } from './_Loading'
import { ReturnBtn } from './_Return'
import { H2 } from './css/css'
import { Row } from 'react-bootstrap'
import { isMobile } from '../services/functions'
import { typeUser } from '../models/typesUsuarios'

export const IndexPage = (props: any) => {

    const user: typeUser = props.user
    const [territories, setTerritories] = useState<number[]>([])

    useEffect(() => {
        //if (!user) window.location.href = "/login"

        if ((!territories || !territories.length) && user && user.asign && user.asign.length) {
            let asignados = user.asign
            asignados.sort((a: number, b: number) => a - b)
            setTerritories(asignados)
        }
    }, [user, territories])

    const btnTerri = {
        width: '120px',
        height: '100px',
        borderRadius: '15px',
        margin: '0 1% 40px 1%',
    }

    return (
        <>
            {ReturnBtn()}
        
            <H2> SELECCIONE UN TERRITORIO </H2>

            <div className="container" style={{ paddingTop: '0', marginBottom: '50px' }}>

                <Row style={{ padding: isMobile ? '40px' : '70px 40px 0px 40px', justifyContent: 'space-evenly' }}>

                    {user && user.isAuth && territories && !!territories.length
                        ?
                        territories.map((territory: number, index: number) => {
                            if (territory) return (
                                <Link type="button" key={index}
                                    className="btn btn-danger" style={btnTerri}
                                    to={`/territorios/${territory?.toString()}/1`}
                                >

                                    <h2 className="h-100 align-middle" style={{
                                        padding: '22%',
                                        margin: 'auto',
                                        fontFamily: '"Arial Black", Gadget, sans-serif',
                                        fontSize: isMobile ? '2.3rem' : ''
                                    }}>
                                        {territory}
                                    </h2>

                                </Link>
                            )
                            else return (<></>)
                        })
                        :
                        <></>
                    }

                    {(!user || !user.isAuth)
                        ?
                        <Loading />
                        :
                        <></>
                    }

                    {user && user.isAuth && user.asign && user.asign.length === 0
                        ?
                        <h3 style={{ marginBottom: '40px' }}>
                            No hay territorios asignados <br/> Hablar con el grupo de territorios
                        </h3>
                        :
                        <></>
                    }

                </Row>
            </div>
        </>
    )
}
