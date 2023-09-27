import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DOMAIN, hthConfigOptions } from '../../../app-config'
import { FC, Fragment, useMemo, useState } from 'react'
import { maskTheBlock, setHTHIsSharedBuildingsService } from '../../../services'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { WhatsAppIcon1 } from '../../commons/WhatsAppIcon1'
import { WhatsappShareButton } from 'react-share'

type propsType = {
    refreshHTHTerritoryHandler: () => void
    territoryHTH: typeHTHTerritory
    territoryNumber: typeTerritoryNumber
}

export const HTHShareAllBuildingsButtons: FC<propsType> = ({ refreshHTHTerritoryHandler, territoryHTH, territoryNumber }) => {
    const isMobile = useSelector((state: typeRootState) => state.mobileMode.isMobile)

    return (
        <div className={`row mx-auto ${isMobile ? 'mb-5' : 'mb-3'}`} style={{ maxWidth: '1000px' }}>
            {hthConfigOptions.blocks.map(b => <Fragment key={b}>
                {!!territoryHTH.map.polygons.filter(p => p.block === b)?.length &&
                 territoryHTH.map.polygons.filter(p => p.block === b).some(f => !!f.buildings?.length) &&
                    <div className={'col'}>
                        <HTHShareBuildingButton
                            faces={territoryHTH.map.polygons.filter(p => p.block === b)}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                            territoryNumber={territoryNumber}
                        />
                    </div>
                }
            </Fragment>)}
        </div>
    )
}


type propsType1 = {
    faces: typePolygon[]
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

const HTHShareBuildingButton: FC<propsType1> = ({ faces, refreshHTHTerritoryHandler, territoryNumber }) => {
    const { config, isMobile, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)
    const [isShared, setIsShared] = useState(false)
    const dispatch = useDispatch()

    const shareUrl = useMemo(() => {
        // if (!faces.some(f => !!f.buildings?.length)) return ''
        let currentUrl = `Territorio ${territoryNumber} - Manzana ${maskTheBlock(faces[0].block, config.usingLettersForBlocks)}\n\n`
        faces.forEach(f =>
            f.buildings?.sort((a, b) => a.streetNumber - b.streetNumber).forEach(b => {
                currentUrl += `${f.street} ${b.streetNumber}`
                currentUrl += `\n`
                currentUrl += `${DOMAIN}/edificio/${user.congregation}/${territoryNumber}/${faces[0].block}/${f.face}/${b.streetNumber}`
                currentUrl += `\n\n`
            })
        )
        return currentUrl
    }, [config.usingLettersForBlocks, faces, territoryNumber, user.congregation])

    const shareHandler = async () => {
        const success = await setHTHIsSharedBuildingsService(territoryNumber, faces[0].block)
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
               title: "Error",
               message: "No se pudieron habilitar los permisos de los edificios",
               animation: 2 
            }))
            return
        }
        setIsShared(true)
        refreshHTHTerritoryHandler()
    }

    return (
        <div style={{ marginBlock: isMobile ? '0' : '40px' }}>

            <style>
                {`
                    .share-btn {
                        border-radius: 10px;
                        border: 1px solid #eaeaea;
                        color: inherit;
                        height: 72px;
                        margin: 1rem;
                        marginInline: 10px;
                        text-align: left;
                        text-decoration: none;
                        transition: color 0.15s ease, border-color 0.15s ease;
                        width: 300px;
                    }
                    .share-btn:hover, .share-btn:focus, .share-btn:active {
                        border-color: #0070f3;
                        color: #0070f3;
                    }
                `}
            </style>

            {isShared ?
                <div className={'text-center'} style={{  }}>
                    <CopyToClipboard text={shareUrl} onCopy={() => setCopiedToClipboard(true)}>
                        <button className={`btn ${copiedToClipboard ? 'btn-general-red' : 'btn-secondary'} py-2`}
                            style={{ width: '300px', maxWidth: '95%', height: '72px', marginBlock: '1rem' }}
                            disabled={!shareUrl}
                        >
                            {copiedToClipboard ? 
                                "Copiados!"
                                :
                                `Copiar Edificios de la manzana ${maskTheBlock(faces[0].block, config.usingLettersForBlocks)} para compartir`
                            }
                        </button>
                    </CopyToClipboard>
                </div>
                :
                <div className={'row d-flex align-items-center justify-content-center'}>
                    <div
                        className={'card share-btn pointer pt-1'}
                        onClick={() => shareHandler()}
                    >
                        <WhatsappShareButton
                            onClick={() => {}}
                            url={shareUrl}
                            className={'ml-1'}
                            style={{ marginTop: '7px' }}
                            windowWidth={660}
                            windowHeight={460}
                        >
                            <div className={'row'}>
                                <div className={'col-2'}>
                                    <WhatsAppIcon1 styles={{ width: '45px' }} />
                                </div>
                                <div className={'col-10 ps-0'}>
                                    &nbsp; Manzana {maskTheBlock(faces[0].block, config.usingLettersForBlocks)}: Enviar los Edificios por WhatsApp
                                    (hay {faces.map(f => f.buildings).filter(b => b && b.length > 0).flat().length})
                                </div>
                            </div>
                        </WhatsappShareButton>
                    </div>
                </div>
            }
        </div>
    )
}
