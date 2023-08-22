import { changeDarkModeReducer } from '../../store'
import { generalBlue } from '../../constants'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'

export const DarkModeButton = () => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch = useDispatch()
    
    return (
        <div className={'form-check form-switch'} style={{ position: 'fixed', bottom: '20px' }}>

            <input id={"darkModeSwitch"}
                className={'form-check-input'}
                checked={isDarkMode}
                onChange={() => dispatch(changeDarkModeReducer())}
                type={'checkbox'}
            />

            <label htmlFor={'darkModeSwitch'}
                className={'form-check-label'}
                style={{ color: isDarkMode ? 'white' : generalBlue }}
            >
                <b> {isMobile ? '' : (isDarkMode ? "Oscuro" : "Claro")} </b>
            </label>

        </div>
    )
}
