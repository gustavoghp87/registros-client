import { H2 } from '../commons'
import { TerritoryNumberBlock } from '.'
import { typeRootState } from '../../models'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const TelephonicSelector = () => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [show, setShow] = useState<boolean>(true)

    useEffect(() => {
        if (user && !user.phoneAssignments.length) setShow(false)
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

            {!show && <><br/><br/><br/></>}

            <br/><br/><br/>
        </>
    )
}
