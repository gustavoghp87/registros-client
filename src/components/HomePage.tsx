import { useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { generalBlue } from './_App'
import { H2 } from './css/css'
import { useAuth } from '../context/authContext'
import { typeUser } from '../models/user'

export const HomePage = () => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    
    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ marginTop: '50px' }}
        >
            BIENVENIDOS
        </H2>

        <a href={user && user.isAuth ? "/index" : "/login"} style={{ textDecoration: 'none' }}>
            <h3 style={{
                margin: '30px auto',
                color: generalBlue,
                textAlign: 'center',
                backgroundColor: 'lightgray',
                padding: '32px 0',
                maxWidth: isMobile ? '100%' : '1136px',
                fontSize: isMobile ? '' : '2.7rem'
            }}>
                ENTRAR
            </h3>
        </a>

        <div style={{ textAlign: 'center', marginTop: isMobile ? '30px' : '40px' }}>
            
            <img src={"/img/world.png"} alt={"jw"} style={{ margin: '15px auto 0 auto', maxWidth: '100%' }} />
        

            <div style={{
                textAlign: 'center', 
                backgroundColor: 'lightgray', 
                padding: '50px 0', 
                maxWidth: isMobile ? '100%' : '1136px',
                margin: 'auto'
            }}>

                <a href={"https://jw.org/es"} target={'_blank'} rel={'noopener noreferrer'}
                    style={{ textDecoration: 'none' }}>
                    
                    <h2 style={{ color: generalBlue, fontSize: isMobile ? '1.5rem' : '2rem' }}>
                        VISITAR JW.ORG
                    </h2>
                
                    <img src={"/img/jw.png"} alt={"jw"} style={{ margin: '15px auto', maxWidth: '100%' }} />
                
                </a>
            </div>
        </div>
    </>
    )
}
