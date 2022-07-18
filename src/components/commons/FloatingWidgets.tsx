import { useEffect, useState } from 'react'
import { ReturnBtn } from './ReturnBtn'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { useAuth } from '../../context/authContext'
import { typeUser } from '../../models/user'

export const FloatingWidgets = () => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const [scrollDown, setScrollDown] = useState<boolean>(false)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY > 100) setScrollDown(true)
            else setScrollDown(false)
        })
        return () => setScrollDown(false)
    }, [])

    return (
        <>
            {!scrollDown && <ReturnBtn />}
        
            <div className={`row`}>

                {window.location.pathname !== '/' && ((isMobile && !scrollDown) || !isMobile) &&
                    <div className={'col-4 offset-6 m-auto'}
                        style={{
                            position: 'relative',
                            zIndex: 6
                        }}
                    >
                        <button className={`btn btn-general-red d-block m-auto mt-2 ${isMobile ? 'btn-sm' : ''}`}
                            onClick={() => window.location.reload()}
                        >
                            Refrescar
                        </button>
                    </div>
                }

                {user && user.isAuth && ((isMobile && !scrollDown) || !isMobile) &&
                    <div className={`col-4 ${isDarkMode ? 'text-white' : ''}`}
                        style={{
                            fontSize: isMobile ? '.9rem' : '',
                            marginRight: '18px',
                            marginTop: '5px',
                            position: 'fixed',
                            right: '0',
                            zIndex: 1
                        }}
                    >
                        <p className={'text-right mb-0'}>
                            {isMobile ? user.email.split('@')[0] : user.email}
                        </p>
                        <p className={'text-right mb-0'}>
                            Grupo {user.group}
                        </p>
                        <p className={'text-right'}>
                            {user.role ? isMobile ? "Admin" : "Administrador" : ""}
                        </p>
                    </div>
                }
            </div>
        </>
    )
}
