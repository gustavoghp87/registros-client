import { typeCongregationItem } from '../pages'

export const SideBar = (props: any) => {

    const currentItemNumber: number = props.currentItemNumber
    const items: typeCongregationItem[] = props.items
    const setCurrentElementNumberHandler: Function = props.setCurrentElementNumberHandler

    const setActiveElement = (element: HTMLElement) => element.classList.add('active')

    const setInactiveElement = (element: HTMLElement) =>{
        element.classList.remove('active')
        setCurrentElementNumberHandler(currentItemNumber)
    }

    return (
        <div className={'mt-5'}>
            <ul className={'list-group mt-5'}>
                {items && items.map((item: typeCongregationItem, index: number) =>
                    <li className={`list-group-item pointer ${currentItemNumber === (index + 1) ? 'active' : ''}`}
                        key={item.title}
                        onClick={() => setCurrentElementNumberHandler(index + 1)}
                        onMouseOver={(e: any) => setActiveElement(e.target)}
                        onMouseLeave={(e: any) => { if (currentItemNumber !== (index + 1)) setInactiveElement(e.target) }}
                    >
                        <span style={{ fontWeight: 'bold' }}> {item.title} </span>
                    </li>
                )}
            </ul>
        </div>
    )
}
