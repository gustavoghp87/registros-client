import { useEffect, useState } from 'react'
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'

export const Col0a = (props: any) => {

    const territory: string = props.territorio
    const manzanas: string[] = props.manzanas
    const manzana: string = props.manzana
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    let radiosManzana: any[] = []
    manzanas?.forEach((manzana: string) => {
        radiosManzana.push({ name: `Manzana ${manzana}`, value: manzana })
    })

    return (
        <Col style={{ textAlign: 'center', marginBottom: '0', padding: '0', maxWidth: '100%' }}>
            {manzanas && !!manzanas.length &&
                <div style={{ marginBottom: '10px' }}>
                    <ButtonGroup
                        vertical={isMobile && manzanas.length > 3 ? true : false}
                        style={{ maxWidth: '100%' }}
                    >
                        {radiosManzana?.map((radio: any, index: number) =>
                        
                            <BlockToggleButton
                                key={index}
                                radio={radio}
                                territory={territory}
                                manzana={manzana}
                            />
                        
                        )}
                    </ButtonGroup>
                </div>
            }
        </Col>
    )
}

type radioObj = {
    name: string
    value: string
}

const BlockToggleButton = (props: any) => {
    const radio: radioObj = props.radio
    const territory: string = props.territory
    const manzana: string = props.manzana
    const [isChecked, setIsChecked] = useState<boolean>(false)

    useEffect(() => {
        setIsChecked(manzana === radio?.value)
    }, [manzana, radio])
    
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
                    backgroundColor: `${isChecked ? '#b02a37' : undefined}`,
                    borderTopLeftRadius: `${radio?.value === "1" ? '3px' : ''}`,
                    borderBottomLeftRadius: `${radio?.value === "1" ? '3px' : ''}`
                }}
                >
                <a href={`/territorios/${territory}/${radio?.value}`} style={{ color: 'white', textDecoration: 'none' }}>
                    <div style={{ height: '40px', width: '120px' }}>
                        <div style={{ lineHeight: '40px' }}>
                            {radio?.name}
                        </div>
                    </div>
                </a>
            </ToggleButton>
        </ButtonGroup>
    </>)
}
