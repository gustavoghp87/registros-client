import { useState, useEffect } from 'react'
import { ReturnBtn } from './_Return'
import { TerritoryNumberBlock } from './blocks/TerritoryNumberBlock'
import { H2 } from './css/css'
import { typeUser } from '../models/typesUsuarios'

export const IndexPage = (props: any) => {

    const user: typeUser = props.user
    const [territories, setTerritories] = useState<number[]>([])
    const [isGhp, setIsGhp] = useState<boolean>(false)
    const [showedMode1, setShowedMode1] = useState<boolean>(false)
    const [showedMode2, setShowedMode2] = useState<boolean>(false)
    const territoriesAll: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56]

    useEffect(() => {
        //if (!user) window.location.href = "/login"

        if ((!territories || !territories.length) && user && user.asign && user.asign.length) {
            let asignados = user.asign
            asignados.sort((a: number, b: number) => a - b)
            setTerritories(asignados)
            if (user.email === 'ghp.2120@gmail.com') setIsGhp(true)
        }
    }, [user, territories])
    

    return (
        <>
            {ReturnBtn()}

            {isGhp &&
            <>
                <H2> CASA EN CASA </H2>

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
        
            <H2> TELEFÓNICA </H2>

            <button className={`btn btn-danger btn-block mt-4`}
                type={'button'}
                onClick={() => setShowedMode2(!showedMode2)}
            >
                {showedMode2 === true ? 'Ocultar' : 'Ver territorios'}
            </button>

            <div className={`${showedMode2 === true ? '' : 'd-none'}`}>
                <div className={'card card-body mt-4'}>
                    <TerritoryNumberBlock user={user} territories={territories} mode={2} />
                </div>
            </div>

        </>
    )
}
