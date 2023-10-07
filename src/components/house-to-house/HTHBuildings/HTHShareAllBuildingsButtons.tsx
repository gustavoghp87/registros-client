import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DOMAIN, hthConfigOptions } from '../../../app-config'
import { FC, Fragment, useMemo, useState } from 'react'
import { maskTheBlock, setHTHIsSharedBuildingsService } from '../../../services'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'
import { WhatsAppIcon1 } from '../../commons/WhatsAppIcon1'
import { WhatsappShareButton } from 'react-share'

const separator = "#####################"
const separator1 = "###########"

type propsType = {
    refreshHTHTerritoryHandler: () => void
    territoryHTH: typeHTHTerritory
    territoryNumber: typeTerritoryNumber
}

export const HTHShareAllBuildingsButtons: FC<propsType> = ({ refreshHTHTerritoryHandler, territoryHTH, territoryNumber }) => {
    const { config, isMobile } = useSelector((state: typeRootState) => ({
        config: state.config,
        isMobile: state.mobileMode.isMobile
    }))
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)
    const dispatch = useDispatch()

    const shareUrl = useMemo(() => {
        let currentUrl = `${separator}\n####  *TERRITORIO ${territoryNumber}*  ####\n${separator}\n\n*Fecha: ${new Date().toLocaleDateString()}*\n\n`
        const doNotCalls = territoryHTH.map.polygons.map(p =>
                p.doNotCalls.map(d => ({ ...d, street: p.street, block: p.block }))
            )
            .filter(x => x.length).flat()
            .sort((a, b) => parseInt(a.block) - parseInt(b.block))
        const facesWithBuildings = territoryHTH.map.polygons.map(p => p).filter(p => p.buildings?.length)
        // cambiar para que se muestren también los No Tocar de las manzanas sin edificios
        const blocksNumbers = [...new Set(facesWithBuildings.map(f => f.block))].sort((a, b) => parseInt(a) - parseInt(b))
        blocksNumbers.forEach(b => {
            currentUrl += `\n${separator1}\n *MANZANA ${maskTheBlock(b, config.usingLettersForBlocks)}*\n${separator1}\n\n`
            if (doNotCalls.some(d => d.block === b)) {
                currentUrl += "*NO TOCAR:*\n"
                doNotCalls.filter(d => d.block === b).forEach(d => {
                    currentUrl += `${d.street} ${d.streetNumber} (${d.date})\n`
                })
                currentUrl += "\n"
            } else {
                currentUrl += "~No hay No Tocar en esta manzana~\n\n"
            }
            const faces = territoryHTH.map.polygons.filter(p => p.block === b)
            faces.forEach(f => {
                f.buildings?.sort((a, b) => a.streetNumber - b.streetNumber).forEach(b => {
                    currentUrl += `${f.street} ${b.streetNumber}`
                    currentUrl += `\n`
                    currentUrl += `${DOMAIN}/edificio/${config.congregation}/${territoryNumber}/${faces[0].block}/${f.face}/${b.streetNumber}`
                    currentUrl += `\n\n`
                })
            })
        })
        return currentUrl
    }, [config.congregation, config.usingLettersForBlocks, territoryHTH.map.polygons, territoryNumber])

    const shareHandler = async () => {
        const success = await setHTHIsSharedBuildingsService(territoryNumber)
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Error",
                message: "No se pudieron habilitar los permisos de los edificios",
                animation: 2 
            }))
            return
        }
        refreshHTHTerritoryHandler()
    }

    return (<>
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
        <div className={'row mt-5'}>
            <div className={'text-center'}>
                <CopyToClipboard text={shareUrl} onCopy={() => setCopiedToClipboard(true)}>
                    <button className={`btn ${copiedToClipboard ? 'btn-general-red' : 'btn-general-blue'} py-2`}
                        style={{ width: '300px', maxWidth: '95%', height: '72px', marginBlock: '1rem' }}
                        onClick={shareHandler}
                        disabled={!shareUrl}
                    >
                        {copiedToClipboard ? 
                            "Copiados!"
                            :
                            `Copiar Edificios y No Tocar de todo el Territorio para compartir`
                        }
                    </button>
                </CopyToClipboard>
            </div>
        </div>
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
    </>)
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
            {isShared ?
                <div className={'text-center'}>
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
