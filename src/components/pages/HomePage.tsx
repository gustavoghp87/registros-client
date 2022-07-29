import { useSelector } from 'react-redux'
import { NavigateFunction, useNavigate } from 'react-router'
import { generalBlue } from '../../config'
import { H2 } from '../commons'
import { typeRootState } from '../../models'

export const HomePage = () => {

    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const navigate: NavigateFunction = useNavigate()

    console.log(user);

    return (
    <>
        <H2 title={"BIENVENIDOS"} />

        <h1 className={`text-center ${isDarkMode ? 'text-white' : ''}`}
            style={{
                fontSize: isMobile ? '2.2rem' : '3.5rem',
                fontWeight: 'bolder'
            }}
        >
            A<br/>MISERICORDIA WEB
        </h1>

        <div onClick={() => navigate(user && user.isAuth ? 'index' : 'acceso')} style={{ cursor: 'pointer', textDecoration: 'none' }}>
            <h3 style={{
                backgroundColor: 'lightgray',
                color: generalBlue,
                fontSize: isMobile ? '2.4rem' : '2.7rem',
                margin: '40px auto',
                maxWidth: isMobile ? '100%' : '1136px',
                padding: '32px 0',
                textAlign: 'center'
            }}>
                ENTRAR
            </h3>
        </div>

        {/* <div style={{ textAlign: 'center', marginTop: isMobile ? '30px' : '40px' }}>
            
            <img src={'/img/world.png'} alt={"jw"} style={{ margin: '15px auto 0 auto', maxWidth: '100%' }} />

            <div style={{
                textAlign: 'center', 
                backgroundColor: 'lightgray', 
                padding: '50px 0', 
                maxWidth: isMobile ? '100%' : '1136px',
                margin: 'auto'
            }}>

                <a href={'https://jw.org/es'} target={'_blank'} rel={'noopener noreferrer'}
                    style={{ textDecoration: 'none' }}>
                    
                    <h2 style={{ color: generalBlue, fontSize: isMobile ? '1.5rem' : '2rem' }}>
                        MISERICORDIAWEB.COM
                    </h2>
                
                    <img src={'/img/jw.png'} alt={"jw"} style={{ margin: '15px auto', maxWidth: '100%' }} />
                
                </a>
            </div>
        </div> */}
    </>
    )
}
