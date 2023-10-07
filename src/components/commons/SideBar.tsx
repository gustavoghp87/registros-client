import { FC } from 'react'
import { typeBoardItem } from '../../models'

type propsType = {
    currentItemNumber: number
    items: typeBoardItem[]
    setCurrentElementNumberHandler: (currentItemNumber: number) => void
}

export const SideBar: FC<propsType> = ({ currentItemNumber, items, setCurrentElementNumberHandler }) => {
    return (
        <ul className={'list-group mt-3'}>
            {items && items.map((item: typeBoardItem, index: number) =>
                <li className={`list-group-item pointer ${currentItemNumber === (index + 1) ? 'active' : ''}`}
                    key={item.title}
                    onClick={() => setCurrentElementNumberHandler(index + 1)}
                    onMouseOver={e => {
                        (e.target as Element).classList.add('active')
                    }}
                    onMouseLeave={e => {
                        if (currentItemNumber !== (index + 1)) {
                            (e.target as Element).classList.remove('active')
                            setCurrentElementNumberHandler(currentItemNumber)
                        }
                    }}
                >
                    <span style={{ fontWeight: 'bold' }}> {item.title} </span>
                </li>
            )}
        </ul>
    )
}
