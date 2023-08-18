import { Config, Logs, Statistics, Users } from '../admins'
import { H2, Hr } from '../commons'
import { hideLoadingModalReducer, showLoadingModalReducer } from '../../store'
import { typeAppDispatch } from '../../models'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'

type adminsSections = '' | 'users' | 'statistics' | 'logs' | 'campaign' | 'config'

export const AdminsPage = () => {
    
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentSection, setCurrentSection] = useState<adminsSections>('')

    useEffect(() => {
        if (isLoading) dispatch(showLoadingModalReducer())
        else dispatch(hideLoadingModalReducer())
    }, [dispatch, isLoading])

    return (
        <>
            <H2 title={"ADMINISTRADORES"} />

            <button className={`btn ${currentSection === 'statistics' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-5 mb-0`}
                onClick={() => setCurrentSection('statistics')}
                style={{ width: '350px' }}
            >
                {currentSection === 'statistics' ? "Estadísticas de Telefónica" : "Ir a Estadísticas de Telefónica"}
            </button>

            <button className={`btn ${currentSection === 'users' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-0`}
                onClick={() => setCurrentSection('users')}
                style={{ width: '350px' }}
            >
                {currentSection === 'users' ? "Usuarios" : "Ir a Usuarios"}
            </button>

            <button className={`btn ${currentSection === 'logs' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-0`}
                onClick={() => setCurrentSection('logs')}
                style={{ width: '350px' }}
            >
                {currentSection === 'logs' ? "Logs de la Aplicación" : "Ir a Logs de la Aplicación"}
            </button>

            <button className={`btn ${currentSection === 'config' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-5`}
                onClick={() => setCurrentSection('config')}
                style={{ width: '350px' }}
            >
                {currentSection === 'config' ? "Configuración de la Aplicación" : "Ir a Configuración de la Aplicación"}
            </button>

            {/* <button className={`btn ${currentSection === 'campaign' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-5`}
                onClick={() => setCurrentSection('campaign')}
                style={{ width: '350px' }}
            >
                {currentSection === 'campaign' ? "Campaña Celulares 2022" : "Ir a Campaña Celulares 2022"}
            </button> */}


            <Hr />


            {currentSection === 'statistics' &&
                <Statistics />
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
