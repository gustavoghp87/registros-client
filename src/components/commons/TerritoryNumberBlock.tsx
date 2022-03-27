import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { Row } from 'react-bootstrap'
import { useAuth } from '../../context/authContext'
import { typeUser } from '../../models/user'

export const TerritoryNumberBlock = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const territories: number[] = props.territories
    const mode: number = props.mode
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    return (
        <div className={'container'} style={{ paddingTop: '0', marginBottom: '0px' }}>

            <Row style={{ padding: isMobile ? '40px' : '40px 40px 40px 40px', justifyContent: 'space-evenly' }}>

                {user && user.isAuth && territories && !!territories.length &&
                    territories.map((territory: number, index: number) => {
                        if (territory) return (
                            <Link type={'button'} key={index}
                                className={mode === 1 ? 'btn btn-success' : 'btn btn-danger'}
                                style={{
                                    width: '120px',
                                    height: '100px',
                                    borderRadius: '15px',
                                    margin: '0 1% 40px 1%'
                                }}
                                to={mode === 1 ? `/casa-en-casa/${territory?.toString()}` : `/territorios/${territory?.toString()}/1`}
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

                {user && user.isAuth && (!user.asign || !user.asign.length) && mode === 2 &&
                    <h3 className={`text-center mb-1 ${isDarkMode ? 'text-white' : ''}`} style={{ }}>
                        No hay territorios de la telefónica asignados <br /> Hablar con el grupo de territorios
                    </h3>
                }

            </Row>
        </div>
    )
}