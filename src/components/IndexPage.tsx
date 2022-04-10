import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { H2 } from './css/css'
import { TerritoryNumberBlock } from './commons/TerritoryNumberBlock'
import { TerritoryCampaigneNumberBlock } from './campaigns/TerritoryCampaignNumberBlock'
import { useAuth } from '../context/authContext'
import { authUserService } from '../services/userServices'
import { typeUser } from '../models/user'

export const IndexPage = () => {
    //const user: typeUser|undefined = useAuth().user
    const refreshUser: (() => void) | undefined = useAuth().refreshUser
    const [user, setUser] = useState<typeUser>()
    const [isGhp, setIsGhp] = useState<boolean>(false)
    const [showedMode1, setShowedMode1] = useState<boolean>(false)
    const [showedMode2, setShowedMode2] = useState<boolean>(true)
    const [showedMode3, setShowedMode3] = useState<boolean>(true)
    const [territories, setTerritories] = useState<number[]>()
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)

    const territoriesAll: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
        31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56]

    useEffect(() => {
        if (!user || !user.isAuth) {
            if (refreshUser) refreshUser()
            authUserService().then((user0: typeUser|null) => {
                if (user0 && (!user0.asign || !user0.asign.length)) setShowedMode2(false)
                if (user0) setUser(user0)
                else { window.location.href = "/"; return }
            })
        }
        if (user && (!territories || !territories.length)) {
            let asignados: number[] = user.asign || []
            if (asignados.length) {
                asignados.sort((a: number, b: number) => a - b)
                setTerritories(asignados)
            }
            if (user.email === 'ghp.2120@gmail.com') setIsGhp(true)
        }
    }, [user, territories, refreshUser])

    return (
        <>
            {isGhp &&
            <>
                <H2 className={isDarkMode ? 'text-white' : ''}> CASA EN CASA </H2>

                <button className={`btn btn-success btn-block mt-4`}
                    type={'button'}
                    onClick={() => setShowedMode1(!showedMode1)}
                >
                    {showedMode1 === true ? 'Ocultar' : 'Ver territorios'}
                </button>

                <div className={`${showedMode1 === true ? '' : 'd-none'}`}>
                    <div className={`card card-body mt-4 ${isDarkMode ? 'bg-dark' : ''}`}>
                        <TerritoryNumberBlock
                            user={user}
                            territories={territoriesAll}
                            mode={1}
                        />
                    </div>
                </div>
                
                {!showedMode1 && <><br/><br/><br/></>}

                <br/><br/><br/>

                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
            </>
            }


        

            <H2 className={isDarkMode ? 'text-white' : ''}> TELEFÓNICA </H2>

            <button className={`btn btn-danger btn-block mt-4`}
                type={'button'}
                onClick={() => setShowedMode2(!showedMode2)}
            >
                {showedMode2 === true ? 'Ocultar' : 'Ver territorios'}
            </button>

            <div className={`${showedMode2 === true ? '' : 'd-none'}`}>
                <div className={`card card-body mt-4 ${isDarkMode ? 'bg-dark' : ''}`}>
                    <TerritoryNumberBlock
                        user={user}
                        territories={territories}
                        mode={2}
                    />
                </div>
            </div>

            {!showedMode2 && <><br/><br/><br/></>}

            <br/><br/><br/>

            <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
            <hr style={{ color: isDarkMode ? 'white' : 'black' }} />




            {/* CAMPAÑA 2022 */}
            
            {user && user.isAuth &&
                <>
                    <H2 className={isDarkMode ? 'text-white' : ''}> CAMPAÑA CELULARES 2022 </H2>
                    
                    <button className={'btn btn-success btn-block mt-4'}
                        type={'button'}
                        onClick={() => setShowedMode3(true)}    // dummy
                    >
                        {showedMode3 === true ? 'Paquetes asignados' : 'Ver paquetes asignados'}
                    </button>

                    <div className={`${showedMode3 === true ? '' : 'd-none'}`}>
                        <div className={`card card-body mt-4 ${isDarkMode ? 'bg-dark' : ''}`}>
                            <TerritoryCampaigneNumberBlock />
                        </div>
                    </div>
                </>
            }
        </>
    )
}
