import { getBoardItems } from '../../services/boardServices'
import { H2, Hr, Loading, SideBar } from '../commons'
import { subirAlTop } from '../../services'
import { typeBoardItem, typeRootState } from '../../models'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const BoardPage = () => {

    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))
    const [currentItem, setCurrentItem] = useState<typeBoardItem>({ title: "", ids: [] })
    const [currentItemNumber, setCurrentItemNumber] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [items, setItems] = useState<typeBoardItem[]>([])

    const setCurrentElementNumberHandler = (element: number): void => setCurrentItemNumber(element)

    useEffect(() => {
        subirAlTop()
        getBoardItems().then((boardItems0: typeBoardItem[]|null) => {
            if (boardItems0) setItems(boardItems0)
        })
    }, [])

    useEffect(() => {
        if (items && currentItemNumber) setCurrentItem(items[currentItemNumber - 1])
    }, [currentItemNumber, items])

    if (!items || !items.length) return (<Loading mt={'120px'} />)

    return (
        <div className={'row w-100 mx-auto'}>
            <div className={`col-lg-2 ${isMobile ? 'mt-3 w-75 mx-auto text-center' : 'mt-5'}`}
                style={{
                    backgroundColor: isMobile ? '' : 'lightgray',
                    height: isMobile ? '500px' : items ? `${20 + items.length * 55}px` : '380px'
                }}
            >
                <SideBar
                    currentItemNumber={currentItemNumber}
                    items={items}
                    setCurrentElementNumberHandler={setCurrentElementNumberHandler}
                />
            </div>

            {isMobile && <Hr classes={'mt-3 mb-0'} />}

            <div className={'col-lg-10'}>
                {currentItem && !!items?.length && items.map((item: typeBoardItem) =>
                    <div className={item.title === currentItem.title ? '' : 'd-none'} key={item.title}>

                        {!isMobile && <Hr styles={{ marginTop: '80px' }} />}

                        <H2 title={item.title.toUpperCase()} mt={'30px'} />

                        {isLoading && <Loading mt={'90px'} mb={'50px'} />}

                        {!!item.ids?.length && item.ids.map((id: string, index: number) =>
                            <iframe
                                allow={'autoplay'}
                                className={'mt-3 mb-5 animate__animated animate__bounceInLeft animate__faster'}
                                height={'700px'}
                                key={id}
                                onLoad={() => setIsLoading(false)}
                                src={`https://drive.google.com/file/d/${id}/preview`}
                                style={{ background: 'lightgray center center no-repeat' }}
                                title={item.title + (index + 1)}
                                width={'100%'}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
