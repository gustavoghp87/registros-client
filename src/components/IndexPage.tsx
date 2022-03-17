import { useState, useEffect } from 'react'
import { ReturnBtn } from './commons/Return'
import { TerritoryNumberBlock } from './commons/TerritoryNumberBlock'
import { RefreshButton } from './commons/RefreshButton'
import { TerritoryCampaigneNumberBlock } from './campaigns/TerritoryCampaignNumberBlock'
import { useAuth } from '../context/authContext'
import { H2 } from './css/css'
import { authUserService } from '../services/userServices'
import { typeUser } from '../models/typesUsuarios'

export const IndexPage = (props: any) => {
    //const user: typeUser|undefined = useAuth().user
    const refreshUser: (() => void) | undefined = useAuth().refreshUser
    const [user, setUser] = useState<typeUser>()
    const [isGhp, setIsGhp] = useState<boolean>(false)
    const [showedMode1, setShowedMode1] = useState<boolean>(false)
    const [showedMode2, setShowedMode2] = useState<boolean>(true)
    const [showedMode3, setShowedMode3] = useState<boolean>(true)
    const [territories, setTerritories] = useState<number[]>()
    const secondaryColor: string = props.secondaryColor

    const territoriesAll: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
        31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56]

    useEffect(() => {
        if (!user || !user.isAuth) {
            if (refreshUser) refreshUser()
            authUserService().then((user0: typeUser|null) => {
                if (user0) setUser(user0)
                else window.location.href = "/"
            })
        }
        //if (!user) window.location.href = "/login"
        if (user && (!territories || !territories.length)) {
            let asignados: number[] = user.asign || []
            if (asignados.length) {
                asignados.sort((a: number, b: number) => a - b)
                setTerritories(asignados)
            } else setShowedMode2(false)
            if (user.email === 'ghp.2120@gmail.com2') setIsGhp(true)
        }
    }, [user, territories, refreshUser])

    return (
        <>
            {ReturnBtn()}
            
            {RefreshButton()}

            {isGhp &&
            <>
                <H2 className={secondaryColor ? 'text-white' : ''}> CASA EN CASA </H2>

                <button className={`btn btn-success btn-block mt-4`}
                    type={'button'}
                    onClick={() => setShowedMode1(!showedMode1)}
                >
                    {showedMode1 === true ? 'Ocultar' : 'Ver territorios'}
                </button>

                <div className={`${showedMode1 === true ? '' : 'd-none'}`}>
                    <div className={'card card-body'}>
                        <TerritoryNumberBlock
                            user={user}
                            territories={territoriesAll}
                            mode={1}
                        />
                    </div>
                </div>
                
                {!showedMode1 && <><br/><br/><br/></>}

                <hr />
                <hr />
            </>
            }


        

            <H2 className={secondaryColor ? 'text-white' : ''}> TELEFÓNICA </H2>

            <button className={`btn btn-danger btn-block mt-4`}
                type={'button'}
                onClick={() => setShowedMode2(!showedMode2)}
            >
                {showedMode2 === true ? 'Ocultar' : 'Ver territorios'}
            </button>

            <div className={`${showedMode2 === true ? '' : 'd-none'}`}>
                <div className={`card card-body mt-4 ${secondaryColor ? 'bg-dark' : ''}`}>
                    <TerritoryNumberBlock
                        user={user}
                        territories={territories}
                        mode={2}
                    />
                </div>
            </div>

            {!showedMode2 && <><br/><br/><br/></>}

            <hr />
            <hr />




            {/* CAMPAÑA 2022 */}
            
            {user && user.isAuth && + new Date() > 1647658800000 &&
                <>
                    <H2 className={secondaryColor ? 'text-white' : ''}> CAMPAÑA CELULARES 2022 </H2>
                    
                    <button className={'btn btn-success btn-block mt-4'}
                        type={'button'}
                        onClick={() => setShowedMode3(!showedMode3)}
                    >
                        {showedMode3 === true ? 'Ocultar' : 'Ver paquetes asignados'}
                    </button>

                    <div className={`${showedMode3 === true ? '' : 'd-none'}`}>
                        <div className={`card card-body mt-4 ${secondaryColor ? 'bg-dark' : ''}`}>
                            <TerritoryCampaigneNumberBlock secondaryColor={secondaryColor} />
                        </div>
                    </div>
                </>
            }
        </>
    )
}
