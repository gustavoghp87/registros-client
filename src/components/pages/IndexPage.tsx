import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { GeoLocationModal, H2, Loading } from '../commons'
import { TerritoryCampaigneNumberBlock } from '../index/TerritoryCampaignNumberBlock'
import { TerritoryNumberBlock } from '../index/TerritoryNumberBlock'
import { typeRootState } from '../../models'

export const IndexPage = () => {

    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [showedMode1, setShowedMode1] = useState<boolean>(false)
    const [showedMode2, setShowedMode2] = useState<boolean>(true)
    const [showedMode3, setShowedMode3] = useState<boolean>(true)
    const [showGeolocationModal, setShowGeolocationModal] = useState<boolean>(false)
    const [territories, setTerritories] = useState<number[]>()
    const territoriesAll: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56]

    const setShowGeolocationModalHandler = (): void => setShowGeolocationModal(false)
    
    useEffect(() => {
        if (user && (!user.asign || !user.asign.length)) setShowedMode2(false)
        if (user && user.asign && !!user.asign.length && (!territories || !territories.length)) {
            let asignados: number[] = [...user.asign]
            asignados = asignados.sort((a: number, b: number) => a - b)
            setTerritories(asignados)
        }
    }, [user, territories])

    return (
        <>
            {(!user || !user.isAuth) &&
                <>
                    <br/> <br/> <br/>
                    <Loading />
                </>
            }

            {user && user.isAdmin && <>

                <H2 title={"CASA EN CASA"} />

                <button className={`btn btn-general-blue btn-block mt-4`}
                    onClick={() => setShowedMode1(!showedMode1)}
                    type={'button'}
                >
                    {showedMode1 === true ? 'Ocultar' : 'Ver territorios'}
                </button>

                {showedMode1 && <>
                    <button className={`btn btn-general-blue d-block mx-auto mt-4 ${isMobile ? 'w-75' : 'w-25'}`}
                        onClick={() => setShowGeolocationModal(true)}
                    >
                        Dónde Estoy
                    </button>
                    <div className={`card card-body mt-4 ${isDarkMode ? 'bg-dark' : ''}`}>
                        <TerritoryNumberBlock
                            mode={1}
                            style={{ cursor: 'pointer' }}
                            territories={territoriesAll}
                            user={user}
                        />
                    </div>
                </>}
                
                {!showedMode1 && <><br/><br/><br/></>}

                <br/><br/><br/>

                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />

                {showGeolocationModal &&
                    <GeoLocationModal 
                        setShowGeolocationModalHandler={setShowGeolocationModalHandler}
                    />
                }

            </>}

            {user && user.isAuth && <>
                <H2 title={"TELEFÓNICA"} />

                <button className={`btn btn-danger btn-block mt-4`}
                    onClick={() => setShowedMode2(!showedMode2)}
                    style={{ cursor: 'pointer' }}
                    type={'button'}
                >
                    {showedMode2 === true ? 'Ocultar' : 'Ver territorios'}
                </button>

                <div className={`${showedMode2 === true ? '' : 'd-none'}`}>
                    <div className={`card card-body mt-4 ${isDarkMode ? 'bg-dark' : ''}`}>
                        <TerritoryNumberBlock
                            user={user}
                            territories={territories}
                            mode={2}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>

                {!showedMode2 && <><br/><br/><br/></>}

                <br/><br/><br/>

                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
            </>}



            {/* CAMPAÑA 2022 */}
            
            {user && user.isAuth &&
                <>
                    <H2 title={"CAMPAÑA CELULARES 2022"} />
                    
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
