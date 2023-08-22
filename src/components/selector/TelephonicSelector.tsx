import { H2 } from '../commons'
import { TerritoryNumberBlock } from '.'
import { typeRootState } from '../../models'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const TelephonicSelector = () => {
    const { config, isDarkMode, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [show, setShow] = useState(true)
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        if (!user.phoneAssignments?.length) setShow(false)
    }, [user])
    
    return (
        <>
            <H2 title={"TELEFÓNICA"} />

            <button className={`btn btn-general-red w-100 pointer mt-4`}
                onClick={() => setShow(x => !x)}
            >
                {show ? 'Ocultar' : 'Ver territorios'}
            </button>

            {show &&
                <>
                    {user.isAdmin &&
                        <button className={`btn btn-general-red pointer mt-4`}
                            onClick={() => setShowAll(x => !x)}
                        >
                            {showAll ? 'Ver solo los asignados' : 'Ver todos los territorios'}
                        </button>
                    }
                    
                    {showAll ?
                        <TerritoryNumberBlock
                            classes={'btn-general-red animate__animated animate__bounce'}
                            territories={Array.from({ length: config.numberOfTerritories }, (_: any, index: number) => index + 1)}
                            url={'/telefonica'}
                            showForecast={false}
                        />
                        :
                        <>
                            {!!user.phoneAssignments?.length ?
                                <TerritoryNumberBlock
                                    classes={'btn-general-red animate__animated animate__bounce'}
                                    territories={[...user.phoneAssignments].sort((a: number, b: number) => a - b)}
                                    url={'/telefonica'}
                                    showForecast={false}
                                />
                                :
                                <h3 className={`text-center my-5 ${isDarkMode ? 'text-white' : ''}`} style={{ }}>
                                    No hay territorios de la Telefónica asignados <br/> Hablar con el grupo de territorios
                                </h3>
                            }
                        </>
                    }
                </>
            }

            {!show && <><br/><br/><br/></>}

            <br/><br/><br/>
        </>
    )
}
