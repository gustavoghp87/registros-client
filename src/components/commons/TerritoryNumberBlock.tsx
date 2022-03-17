import { Link } from 'react-router-dom'
import { Row } from 'react-bootstrap'
import { useAuth } from '../../context/authContext'
import { isMobile } from '../../services/functions'
import { typeUser } from '../../models/typesUsuarios'

export const TerritoryNumberBlock = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const territories: number[] = props.territories
    const mode: number = props.mode

    const btnTerri = {
        width: '120px',
        height: '100px',
        borderRadius: '15px',
        margin: '0 1% 40px 1%'
    }

    return (
        <div className={'container'} style={{ paddingTop: '0', marginBottom: '50px' }}>

            <Row style={{ padding: isMobile ? '40px' : '70px 40px 0px 40px', justifyContent: 'space-evenly' }}>

                {user && user.isAuth && territories && !!territories.length &&
                    territories.map((territory: number, index: number) => {
                        if (territory) return (
                            <Link type={'button'} key={index}
                                className={mode === 1 ? 'btn btn-success' : 'btn btn-danger'} style={btnTerri}
                                to={mode === 1 ? `/casaencasa/${territory?.toString()}` : `/territorios/${territory?.toString()}/1`}
                            >

                                <h2 className={'h-100'}
                                    style={{
                                        padding: '22%',
                                        margin: 'auto',
                                        fontFamily: '"Arial Black", Gadget, sans-serif',
                                        fontSize: isMobile ? '2.3rem' : ''
                                    }}
                                >
                                    {territory}
                                </h2>

                            </Link>
                        )
                        else return (<></>)
                    })
                }

                {user && user.isAuth && user.asign?.length === 0 && mode === 2 &&
                    <h3 className={'text-center mb-4'} style={{ }}>
                        No hay territorios asignados <br /> Hablar con el grupo de territorios
                    </h3>
                }

            </Row>
        </div>
    )
}