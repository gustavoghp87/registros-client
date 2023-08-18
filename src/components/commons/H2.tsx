import { FC } from 'react';
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    mb?: string;
    mt?: string;
    title: string;
}

export const H2: FC<propsType> = ({ mb, mt, title}) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))

    return (
        <h2 className={`text-center ${isDarkMode ? 'text-white' : ''}`}
            style={{
                fontSize: isMobile ? '2.4rem' : '3.5rem',
                fontWeight: 'bolder',
                marginTop: mt ?? '80px',
                marginBottom: mb ?? ''
            }}
        >
            {title}
        </h2>
    )
}
