import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { H2, Loading, SideBar } from '../commons'
import { getCongregationItems } from '../../services/congregationServices'
import { typeRootState } from '../../models'

export type typeCongregationItem = {
    title: string
    ids: string[]
}

export const CongregationPage = () => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [currentItem, setCurrentItem] = useState<typeCongregationItem>()
    const [currentItemNumber, setCurrentItemNumber] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [items, setItems] = useState<typeCongregationItem[]>()

    const setCurrentElementNumberHandler = (element: number): void => setCurrentItemNumber(element)

    useEffect(() => {
        getCongregationItems().then((congregationItems0: typeCongregationItem[]|null) => {
            if (congregationItems0) setItems(congregationItems0)
        })
    }, [])

    useEffect(() => window.scrollTo(0, 0), [])

    useEffect(() => {
        if (!items) return
        if (currentItemNumber === 1) setCurrentItem(items[0])
        else if (currentItemNumber === 2) setCurrentItem(items[1])
        else if (currentItemNumber === 3) setCurrentItem(items[2])
        else if (currentItemNumber === 4) setCurrentItem(items[3])
        else if (currentItemNumber === 5) setCurrentItem(items[4])
        else if (currentItemNumber === 6) setCurrentItem(items[5])

        //document.querySelectorAll("ali#credit").forEach(el=>el.click())
        // const list0 = Array.from(document.querySelectorAll('[aria-label="Fit to width"]')) as HTMLElement[]
        // const list1 = Array.from(document.querySelectorAll('[aria-label="Ajustar al ancho"]')) as HTMLElement[]
        // list
        // // list0.forEach((x: HTMLElement) => x = x.click())
        // // list1.forEach((x: HTMLElement) => x.click())
        // console.log(list0.length)
        

    }, [currentItemNumber, items])

    if (!items) return (<Loading mt={24} />)

    return (
        <div className={'row'}>
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

            {isMobile && <hr className={`mt-3 mb-0 ${isDarkMode ? 'text-white' : ''}`} />}

            <div className={'col-lg-10'}>
                {currentItem && items && !!items.length && items.map((item: typeCongregationItem) =>
                    <div className={item.title === currentItem.title ? '' : 'd-none'} key={item.title}>

                        {!isMobile && <hr className={''} style={{ marginTop: '80px' }} />}

                        <H2 title={item.title.toUpperCase()} mt={'30px'} />

                        {isLoading && <Loading mt={18} mb={10} />}

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
