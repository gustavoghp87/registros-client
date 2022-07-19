import { useSelector } from 'react-redux'
import { generalBlue } from '../config'
import { useAuth } from '../context/authContext'
import { typeRootState, typeUser } from '../models'
import { H2 } from './css/css'

export const HomePage = () => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    
    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ marginTop: '60px' }}
        >
            BIENVENIDOS
            <br/>
            A
            <br/>
            MISERICORDIA WEB
        </H2>

        <a href={user && user.isAuth ? '/index' : '/acceso'} style={{ textDecoration: 'none' }}>
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
        </a>

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
