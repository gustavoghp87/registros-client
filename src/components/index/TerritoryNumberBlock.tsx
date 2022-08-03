import { useSelector } from 'react-redux'
import { NavigateFunction, useNavigate } from 'react-router'
import { Row } from 'react-bootstrap'
import { typeRootState } from '../../models'

export const TerritoryNumberBlock = (props: any) => {

    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const navigate: NavigateFunction = useNavigate()
    const mode: number = props.mode
    const territories: number[] = props.territories

    return (
        <div className={'container pt-0 mb-0'}>

            <Row style={{
                padding: mode === 1 && isMobile ? '10px' : '40px',
                justifyContent: 'space-evenly'
            }}>

                {user && user.isAuth && territories && !!territories.length && territories.map((territory: number) =>
                    <button key={territory}
                        className={`btn animate__animated ${mode === 1 ? 'btn-general-blue animate__rubberBand' : 'btn-general-red animate__bounce'}`}
                        onClick={() => navigate(mode === 1 ?
                            `/casa-en-casa/${territory?.toString()}`
                            :
                            `/territorios/${territory?.toString()}`
                        )}
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
                )}
            </Row>

            {user && user.isAuth && (!user.asign || !user.asign.length) && mode === 2 &&
                <h3 className={`text-center mb-5 ${isDarkMode ? 'text-white' : ''}`} style={{ }}>
                    No hay territorios de la telefónica asignados <br /> Hablar con el grupo de territorios
                </h3>
            }

        </div>
    )
}