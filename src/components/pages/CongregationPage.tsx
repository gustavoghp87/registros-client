import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { H2, Loading, SideBar } from '../commons'
import { getCongregationItems } from '../../services/congregationServices'
import { typeCongregationItem, typeRootState } from '../../models'

export const CongregationPage = () => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [currentItem, setCurrentItem] = useState<typeCongregationItem>({ title: "", ids: [] })
    const [currentItemNumber, setCurrentItemNumber] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [items, setItems] = useState<typeCongregationItem[]>([])

    const setCurrentElementNumberHandler = (element: number): void => setCurrentItemNumber(element)

    useEffect(() => {
        window.scrollTo(0, 0)
        getCongregationItems().then((congregationItems0: typeCongregationItem[]|null) => {
            if (congregationItems0) setItems(congregationItems0)
        })
    }, [])

    useEffect(() => {
        if (!items) return
        if (currentItemNumber === 1) setCurrentItem(items[0])
        else if (currentItemNumber === 2) setCurrentItem(items[1])
        else if (currentItemNumber === 3) setCurrentItem(items[2])
        else if (currentItemNumber === 4) setCurrentItem(items[3])
        else if (currentItemNumber === 5) setCurrentItem(items[4])
        else if (currentItemNumber === 6) setCurrentItem(items[5])
    }, [currentItemNumber, items])

    if (!items || !items.length) return (<Loading mt={'120px'} />)

    return (
        <div className={'row w-100'}>
            <div className={`col-lg-2 ${isMobile ? 'mt-3 w-75 mx-auto text-center' : 'mt-5'}`}
                style={{
                    backgroundColor: isMobile ? '' : 'lightgray',
                    maxHeight: isMobile ? '500px' : '380px'
                }}
            >
                <SideBar
                    currentItemNumber={currentItemNumber}
                    items={items}
                    setCurrentElementNumberHandler={setCurrentElementNumberHandler}
                />
            </div>

            {isMobile && <hr className={`mt-3 mb-0 ${isDarkMode ? 'text-white' : ''}`} style={{ maxWidth: '99%' }} />}

            <div className={'col-lg-10'}>
                {currentItem && items && !!items.length && items.map((item: typeCongregationItem) =>
                    <div className={item.title === currentItem.title ? '' : 'd-none'} key={item.title}>

                        {!isMobile && <hr className={isDarkMode ? 'text-white' : ''} style={{ marginTop: '80px' }} />}

                        <H2 title={item.title.toUpperCase()} mt={'30px'} />

                        {isLoading && <Loading mt={'90px'} mb={'50px'} />}

                        {item.ids && !!item.ids.length && item.ids.map((id: string, index: number) =>
                            <iframe
                                allow={'autoplay'}
                                className={'mt-3 mb-5 animate__animated animate__bounceInLeft animate__faster'}
                                height={'700px'}
                                key={index}
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
