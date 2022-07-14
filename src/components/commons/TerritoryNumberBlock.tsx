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
        <div className={'container pt-0 mb-0'}>

            <Row style={{
                padding: mode === 1 && isMobile ? '10px' : '40px',
                justifyContent: 'space-evenly'
            }}>

                {user && user.isAuth && territories && !!territories.length &&
                    territories.map((territory: number, index: number) => {
                        if (territory) return (
                            <button key={index}
                                onClick={() => mode === 1 ? window.location.href = `/casa-en-casa/${territory?.toString()}` : `/territorios/${territory?.toString()}/1`}
                                className={`'btn ${mode === 1 ? 'btn-general-blue' : 'btn-danger'} animate__animated animate__bounce`}
                                style={{
                                    borderRadius: '15px',
                                    height: mode === 1 && isMobile ? '60px' : '100px',
                                    margin: '0 1% 40px 1%',
                                    width: mode === 1 && isMobile ? '90px' : '120px'
                                }}
                            >

                                <h2 className={'h-100 mt-1'}
                                    style={{
                                        padding: mode === 1 && isMobile ? '10%' : '22%',
                                        margin: 'auto',
                                        fontFamily: '"Arial Black", Gadget, sans-serif',
                                        fontSize: isMobile ? (mode === 1 && isMobile) ? '1.8rem' : '2.3rem' : ''
                                    }}
                                >
                                    {territory}
                                </h2>

                            </button>
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