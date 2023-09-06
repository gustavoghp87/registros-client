import { Config, Logs, StatisticsHTH, StatisticsTelephonic, Users } from '../admins'
import { H2, Hr } from '../commons'
import { hideLoadingModalReducer, showLoadingModalReducer } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

type typeAdminsSections = '' | 'campaign' | 'config' | 'logs' | 'statistics-hth' | 'statistics-telephonic' | 'users'

const styles = { width: '350px' }

const getSection = (): typeAdminsSections => {
    const relativePath = window.location.pathname
    if (relativePath === '/admins/estadisticas-telefonica') return 'statistics-telephonic'
    if (relativePath === '/admins/estadisticas-casa-en-casa') return 'statistics-hth'
    if (relativePath === '/admins/usuarios') return 'users'
    if (relativePath === '/admins/logs') return 'logs'
    if (relativePath === '/admins/config') return 'config'
    return ''
}

export const AdminsPage = () => {
    const [currentSection, setCurrentSection] = useState<typeAdminsSections>(getSection())
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getClasses = (section: typeAdminsSections) => (
        `btn ${currentSection === section ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-0`
    );

    useEffect(() => {
        setCurrentSection(getSection())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname])

    useEffect(() => {
        if (isLoading) dispatch(showLoadingModalReducer())
        else dispatch(hideLoadingModalReducer())
    }, [dispatch, isLoading])

    return (
        <>
            <H2 title={"ADMINISTRADORES"} mb={'50px'} />

            <button className={getClasses('statistics-hth')}
                onClick={() => navigate('/admins/estadisticas-casa-en-casa')}
                style={styles}
            >
                {currentSection === 'statistics-hth' ? "Estadísticas de Casa en Casa" : "Ir a Estadísticas de Casa en Casa"}
            </button>

            <button className={getClasses('statistics-telephonic')}
                onClick={() => navigate('/admins/estadisticas-telefonica')}
                style={styles}
            >
                {currentSection === 'statistics-telephonic' ? "Estadísticas de Telefónica" : "Ir a Estadísticas de Telefónica"}
            </button>

            <button className={getClasses('users')}
                onClick={() => navigate('/admins/usuarios')}
                style={styles}
            >
                {currentSection === 'users' ? "Usuarios" : "Ir a Usuarios"}
            </button>

            <button className={getClasses('logs')}
                onClick={() => navigate('/admins/logs')}
                style={styles}
            >
                {currentSection === 'logs' ? "Logs de la Aplicación" : "Ir a Logs de la Aplicación"}
            </button>

            <button className={getClasses('config')}
                onClick={() => navigate('/admins/config')}
                style={styles}
            >
                {currentSection === 'config' ? "Configuración de la Aplicación" : "Ir a Configuración de la Aplicación"}
            </button>

            {/* <button className={getClasses('campaign')}
                onClick={() => navigate('/admins/campañas')}
                style={styles}
            >
                {currentSection === 'campaign' ? "Campaña Celulares 2022" : "Ir a Campaña Celulares 2022"}
            </button> */}


            <Hr classes='mt-5' />

            {currentSection === 'statistics-hth' &&
                <StatisticsHTH />
            }

            {currentSection === 'statistics-telephonic' &&
                <StatisticsTelephonic />
            }

            {currentSection === 'users' &&
                <Users setIsLoading={setIsLoading} />
            }

            {currentSection === 'logs' &&
                <Logs />
            }

            {currentSection === 'config' &&
                <Config />
            }

            {/* {currentSection === 'campaign' &&
                <Campaign setIsLoading={setIsLoading} />
            } */}

        </>
    )
}
