import { useEffect, useState } from 'react'
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { generalRed } from '../../config'
import { danger, dark, typeBlock, typeRootState } from '../../models'

type radioObj = {
    name: string
    value: string
}

export const Col0a = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const blocks: typeBlock[] = props.blocks
    const currentBlock: string = props.currentBlock
    const setCurrentBlockHandler: Function = props.setCurrentBlockHandler

    let radiosCurrentBlock: radioObj[] = []
    blocks?.forEach((block: string) => {
        radiosCurrentBlock.push({ name: `Manzana ${block}`, value: block })
    })

    return (
        <Col className={'text-center mb-0 p-0'} style={{ maxWidth: '100%' }}>
            {blocks && !!blocks.length &&
                <div style={{ marginBottom: '10px' }}>
                    <ButtonGroup
                        vertical={isMobile && blocks.length > 3 ? true : false}
                        style={{ maxWidth: '100%' }}
                    >
                        {radiosCurrentBlock?.map((radio: radioObj) =>
                            <BlockToggleButton
                                currentBlock={currentBlock}
                                key={radio.value}
                                radio={radio}
                                setCurrentBlockHandler={setCurrentBlockHandler}
                            />
                        )}
                    </ButtonGroup>
                </div>
            }
        </Col>
    )
}

const BlockToggleButton = (props: any) => {
    const currentBlock: typeBlock = props.currentBlock
    const radio: radioObj = props.radio
    const setCurrentBlockHandler: Function = props.setCurrentBlockHandler
    const [isChecked, setIsChecked] = useState<boolean>(false)

    useEffect(() => {
        setIsChecked(currentBlock === radio?.value)
    }, [currentBlock, radio])
    
    return (
    <>
        <ButtonGroup>
            <ToggleButton
                type={'radio'}
                variant={isChecked ? danger : dark}
                name={"radio"}
                value={radio?.value}
                //checked={isChecked}
                style={{
                    padding: '0',
                    backgroundColor: `${isChecked ? generalRed : ''}`,
                    borderTopLeftRadius: `${radio?.value === "1" ? '3px' : ''}`,
                    borderBottomLeftRadius: `${radio?.value === "1" ? '3px' : ''}`
                }}
                >
                <div className={'text-white'}
                    onClick={() => setCurrentBlockHandler(radio.value)}
                    style={{ height: '40px', lineHeight: '40px', width: '120px' }}
                >
                    {radio?.name}
                </div>
            </ToggleButton>
        </ButtonGroup>
    </>)
}
