import { useSelector } from 'react-redux'
import { typeRootState } from '../../models'

export const Hr = (props: any) => {

    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)

    return (
        <hr className={`d-block mx-auto ${isDarkMode ? 'bg-dark ' : ''}${props.classes ? props.classes : ''}`}
            style={{ ...props.styles }}
        />
    )
}
