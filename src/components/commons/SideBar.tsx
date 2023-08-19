import { FC } from 'react'
import { typeBoardItem } from '../../models'

type propsType = {
    currentItemNumber: number
    items: typeBoardItem[]
    setCurrentElementNumberHandler: (currentItemNumber: number) => void
}

export const SideBar: FC<propsType> = ({ currentItemNumber, items, setCurrentElementNumberHandler }) => {
    const setActiveElement = (element: HTMLElement) => element.classList.add('active')

    const setInactiveElement = (element: HTMLElement) =>{
        element.classList.remove('active')
        setCurrentElementNumberHandler(currentItemNumber)
    }

    return (
        <ul className={'list-group mt-3'}>
            {items && items.map((item: typeBoardItem, index: number) =>
                <li className={`list-group-item pointer ${currentItemNumber === (index + 1) ? 'active' : ''}`}
                    key={item.title}
                    onClick={() => setCurrentElementNumberHandler(index + 1)}
                    onMouseOver={(e: any) => setActiveElement(e.target)}
                    onMouseLeave={(e: any) => currentItemNumber !== (index + 1) ? setInactiveElement(e.target) : undefined}
                >
                    <span style={{ fontWeight: 'bold' }}> {item.title} </span>
                </li>
            )}
        </ul>
    )
}
