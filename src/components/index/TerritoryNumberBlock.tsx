import { useSelector } from 'react-redux'
import { Row } from 'react-bootstrap'
import { useAuth } from '../../context/authContext'
import { typeRootState, typeUser } from '../../models'

export const TerritoryNumberBlock = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const mode: number = props.mode
    const territories: number[] = props.territories

    return (
        <div className={'container pt-0 mb-0'}>

            <Row style={{
                padding: mode === 1 && isMobile ? '10px' : '40px',
                justifyContent: 'space-evenly'
            }}>

                {user && user.isAuth && territories && !!territories.length && territories.map((territory: number) => {
                    if (territory) return (
                        <button key={territory}
                            onClick={() => window.location.href = mode === 1 ?
                                `/casa-en-casa/${territory?.toString()}`
                                :
                                `/territorios/${territory?.toString()}`
                            }
                            className={`btn ${mode === 1 ? 'btn-general-blue' : 'btn-danger'} animate__animated animate__bounce`}
                            style={{
                                borderRadius: '15px',
                                height: mode === 1 && isMobile ? '60px' : '100px',
                                margin: '0 1% 40px 1%',
                                width: mode === 1 && isMobile ? '90px' : '120px'
                            }}
                        >
                            <h2 className={'h-100 mt-1'}
                                style={{
                                    fontFamily: '"Arial Black", Gadget, sans-serif',
                                    fontSize: isMobile ? (mode === 1 && isMobile) ? '1.8rem' : '2.3rem' : '',
                                    margin: 'auto',
                                    padding: mode === 1 && isMobile ? '5%' : '20%'
                                }}
                            >
                                {territory}
                            </h2>
                        </button>
                    )
                    else return (<></>)
                })}

                {user && user.isAuth && (!user.asign || !user.asign.length) && mode === 2 &&
                    <h3 className={`text-center mb-1 ${isDarkMode ? 'text-white' : ''}`} style={{ }}>
                        No hay territorios de la telefónica asignados <br /> Hablar con el grupo de territorios
                    </h3>
                }

            </Row>
        </div>
    )
}