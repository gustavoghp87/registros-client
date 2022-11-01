import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Logs, Statistics, Users } from '../admins'
import { H2, Hr } from '../commons'
import { hideLoadingModalReducer, showLoadingModalReducer } from '../../store'
import { typeAppDispatch } from '../../models'

type adminsSections = 'users' | 'statistics' | 'logs' | 'campaign'

export const AdminsPage = () => {
    
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentSection, setCurrentSection] = useState<adminsSections>('users')

    useEffect(() => window.scrollTo(0, 0), [])

    useEffect(() => {
        if (isLoading) dispatch(showLoadingModalReducer())
        else dispatch(hideLoadingModalReducer())
    }, [dispatch, isLoading])

    return (
        <>
            <H2 title={"ADMINISTRADORES"} />

            <button className={`btn ${currentSection === 'users' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-5 mb-0`}
                onClick={() => setCurrentSection('users')}
                style={{ width: '300px' }}
            >
                {currentSection === 'users' ? "Usuarios" : "Ir a Usuarios"}
            </button>

            <button className={`btn ${currentSection === 'statistics' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-0`}
                onClick={() => setCurrentSection('statistics')}
                style={{ width: '300px' }}
            >
                {currentSection === 'statistics' ? "Estadísticas de Telefónica" : "Ir a Estadísticas de Telefónica"}
            </button>

            <button className={`btn ${currentSection === 'logs' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-5`}
                onClick={() => setCurrentSection('logs')}
                style={{ width: '300px' }}
            >
                {currentSection === 'logs' ? "Logs de la Aplicación" : "Ir a Logs de la Aplicación"}
            </button>

            {/* <button className={`btn ${currentSection === 'campaign' ? 'btn-general-blue' : 'btn-general-red'} btn-size12 d-block mx-auto mt-4 mb-5`}
                onClick={() => setCurrentSection('campaign')}
                style={{ width: '300px' }}
            >
                {currentSection === 'campaign' ? "Campaña Celulares 2022" : "Ir a Campaña Celulares 2022"}
            </button> */}


            <Hr />


            {currentSection === 'users' &&
                <Users setIsLoading={setIsLoading} />
            }

            {currentSection === 'statistics' &&
                <Statistics />
            }

            {currentSection === 'logs' &&
                <Logs />
            }

            {/* {currentSection === 'campaign' &&
                <Campaign setIsLoading={setIsLoading} />
            } */}

        </>
    )
}
