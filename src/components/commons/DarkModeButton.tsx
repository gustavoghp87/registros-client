import { useDispatch, useSelector } from 'react-redux'
import { changeDarkModeReducer } from '../../store'
import { generalBlue, typeAppDispatch, typeRootState } from '../../models'

export const DarkModeButton = () => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    
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
