import { useSelector } from 'react-redux'
import { typeRootState } from '../../models'

export const H2 = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))

    return (
        <h2 className={`text-center ${isDarkMode ? 'text-white' : ''}`}
            style={{
                fontSize: isMobile ? '2.4rem' : '3.5rem',
                fontWeight: 'bolder',
                marginTop: props.mt ?? '80px',
                marginBottom: props.mb ?? ''
            }}
        >
            {props.title}
        </h2>
    )
}
