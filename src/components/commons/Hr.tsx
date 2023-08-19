import { FC } from 'react'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    classes?: string
    styles?: object
}

export const Hr: FC<propsType> = ({ classes, styles }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)

    return (
        <hr className={`${isDarkMode ? 'text-white ' : ''}${classes ? classes : ''}`}
            style={{ ...styles }}
        />
    )
}
