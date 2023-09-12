import { FC, useEffect, useRef, useState } from 'react'
import { setHTHIsSharedBuildingsService } from '../../../services'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { WhatsAppIcon1 } from '../../commons/WhatsAppIcon1'
import { WhatsappShareButton } from 'react-share'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHShareBuildingButton: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const [isShareButtonDisabled, setIsShareButtonDisabled] = useState(true)
    const [url, setUrl] = useState("")
    const dispatch = useDispatch()
    const shareButton = useRef<any>()
    const user = useSelector((state: typeRootState) => state.user)

    const shareBuildingHandler = (): void => {
        let currentUrl: string = '\n\n'
        const checkboxes = Array.from(document.getElementsByClassName('share-building')) as Array<HTMLInputElement>
        if (!checkboxes) return
        const buildings: number[] = []
        checkboxes.forEach((checkbox: HTMLInputElement) => {
            if (checkbox.checked) {
                const streetNumber: number = parseInt(checkbox.value)
                if (territoryNumber && currentFace && currentFace.block && currentFace.face && currentFace.street && streetNumber && !isNaN(streetNumber)) {
                    currentUrl += `Edificio ${currentFace.street} ${streetNumber} (Territorio ${territoryNumber})\n\nhttps://www.misericordiaweb.com/edificio/${user.congregation}/${territoryNumber}/${currentFace.block}/${currentFace.face}/${streetNumber}\n\n`
                    buildings.push(streetNumber)
                }
                checkbox.checked = false
            }
        })
        if (buildings.length) {
            setHTHIsSharedBuildingsService(territoryNumber, currentFace.block, currentFace.face, currentFace.id, buildings).then((success: boolean) => {
                if (!success) dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: `${buildings.length > 1 ? "No se pudieron compartir los edificios" : "No se pudo compartir el edificio"}`,
                    animation: 2
                }))
                refreshHTHTerritoryHandler()
            })
        }
        setUrl(currentUrl)
    }

    useEffect(() => {
        setInterval(() => {
            const checkboxes = Array.from(document.getElementsByClassName('share-building')) as Array<HTMLInputElement>
            if (!checkboxes) return
            const someChecked: boolean = checkboxes.some(x => x.checked)
            setIsShareButtonDisabled(!someChecked)
        }, 300)
    }, [])

    useEffect(() => {
        if (!shareButton.current || !url) return
        shareButton.current.click()
        const checkboxes = Array.from(document.getElementsByClassName('share-building')) as Array<HTMLInputElement>
        if (checkboxes) {
            checkboxes.forEach((checkbox: HTMLInputElement) => {
                if (checkbox.checked) checkbox.checked = false
            })
        }
    }, [url])

    return (<>
        <button className={'btn btn-general-blue d-block mx-auto mt-4'}
            disabled={isShareButtonDisabled}
            onClick={() => shareBuildingHandler()}
        >
            &nbsp; Compartir por WhatsApp &nbsp; <WhatsAppIcon1 styles={{ width: '40px' }} />
        </button>
        <WhatsappShareButton
            className={'d-none'}
            ref={shareButton}
            style={{ marginTop: '7px' }}
            title={"EDIFICIOS - CASA EN CASA"}
            url={url}
            windowHeight={460}
            windowWidth={660}
        >
        </WhatsappShareButton>
    </>)
}
