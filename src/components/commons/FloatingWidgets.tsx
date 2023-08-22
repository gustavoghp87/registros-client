import { ReturnBtn } from './'
import { typeRootState } from '../../models'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const FloatingWidgets = () => {
    const { config, isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [scrollDown, setScrollDown] = useState(false)

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

                {user.isAuth && ((isMobile && !scrollDown) || !isMobile) &&
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
                        <p className={'text-end mb-0'}>
                            {isMobile ? user.email.split('@')[0] : user.email}
                        </p>
                        <p className={'text-end mb-0'}>
                            {config.name} - Grupo {user.group}
                        </p>
                        {user.isAdmin &&
                            <p className={'text-end'}>
                                {isMobile ? "Admin" : "Administrador"}
                            </p>
                        }
                    </div>
                }
            </div>
        </>
    )
}
