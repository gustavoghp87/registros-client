import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { FC, useEffect, useState } from 'react'
import { generalRed } from '../../constants'
import { typeBlock, typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type radioObj = {
    name: string
    value: string
}

type propsType = {
    blocks?: typeBlock[]
    currentBlock?: typeBlock
    setCurrentBlockHandler: (value: typeBlock) => void
}

export const Col0a: FC<propsType> = ({ blocks, currentBlock, setCurrentBlockHandler }) => {
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

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

type propsType1 = {
    currentBlock?: typeBlock
    radio: radioObj
    setCurrentBlockHandler: (value: typeBlock) => void
}

const BlockToggleButton: FC<propsType1> = ({ currentBlock, radio, setCurrentBlockHandler }) => {
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        setIsChecked(currentBlock === radio?.value)
    }, [currentBlock, radio])
    
    return (
    <>
        <ButtonGroup>
            <ToggleButton
                type={'radio'}
                variant={isChecked ? 'danger' : 'dark'}
                name={"radio"}
                value={radio?.value}
                //checked={isChecked}
                style={{
                    padding: '0',
                    backgroundColor: `${isChecked ? generalRed : ''}`,
                    borderTopLeftRadius: `${radio?.value === '1' ? '3px' : ''}`,
                    borderBottomLeftRadius: `${radio?.value === '1' ? '3px' : ''}`
                }}
                >
                <div className={'text-white'}
                    onClick={() => setCurrentBlockHandler(radio.value as typeBlock)}
                    style={{ height: '40px', lineHeight: '40px', width: '120px' }}
                >
                    {radio?.name}
                </div>
            </ToggleButton>
        </ButtonGroup>
    </>)
}
