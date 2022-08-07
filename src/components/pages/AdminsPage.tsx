import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users } from '../admins'
import { H2 } from '../commons'
import { hideLoadingModalReducer, showLoadingModalReducer } from '../../store'
import { typeAppDispatch, typeRootState } from '../../models'

type adminsSections = 'users' | 'statistics' | 'logs' | 'campaign'

export const AdminsPage = () => {
    
    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentSection, setCurrentSection] = useState<adminsSections>('users')

    useEffect(() => {
        if (isLoading) dispatch(showLoadingModalReducer())
        else dispatch(hideLoadingModalReducer())
    }, [dispatch, isLoading])

    return (
        <>
            <H2 title={"ADMINISTRADORES"} />

            <button className={'btn btn-general-red btn-size12 d-block mx-auto mt-5 mb-0'}
                onClick={() => setCurrentSection('users')}
                style={{ width: '300px' }}
            >
                Usuarios
            </button>

            <button className={'btn btn-general-red btn-size12 d-block mx-auto mt-4 mb-0'}
                onClick={() => setCurrentSection('statistics')}
                style={{ width: '300px' }}
            >
                Ir a Estadísticas de Telefónica
            </button>

            <button className={'btn btn-general-red btn-size12 d-block mx-auto mt-4 mb-0'}
                onClick={() => setCurrentSection('logs')}
                style={{ width: '300px' }}
            >
                Ir a Logs de la Aplicación
            </button>

            <button className={'btn btn-general-red btn-size12 d-block mx-auto mt-4 mb-5'}
                onClick={() => setCurrentSection('campaign')}
                style={{ width: '300px' }}
            >
                Ir a Campaña Celulares 2022
            </button>


            <hr style={{ color: isDarkMode ? 'white' : 'black' }} />


            {currentSection === 'users' &&
                <Users
                    setIsLoading={setIsLoading}
                />
            }

            {currentSection === 'statistics' &&
                <Users
                    setIsLoading={setIsLoading}
                />
            }

            {currentSection === 'logs' &&
                <Users
                    setIsLoading={setIsLoading}
                />
            }

            {currentSection === 'campaign' &&
                <Users
                    setIsLoading={setIsLoading}
                />
            }

        </>
    )
}
