import { useDispatch, useSelector } from 'react-redux'
import { changeDarkModeReducer } from '../../store/DarkModeSlice'
import { typeAppDispatch, typeRootState } from '../../models'

export const DarkModeButton = () => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    
    return (
        <div className={'custom-control custom-switch'} style={{ position: 'fixed', bottom: '20px' }}>
            <input className={'custom-control-input'}
                type={'checkbox'}
                id={"customSwitches"}
                checked={isDarkMode}
                onChange={() => dispatch(changeDarkModeReducer())}
            />
            <label className={'custom-control-label'}
                htmlFor={'customSwitches'}
                style={{ color: isDarkMode ? 'white' : 'red' }}
            >
                <b> {isMobile ? '' : (isDarkMode ? 'Modo Claro' : 'Modo Oscuro')} </b>
            </label>
        </div>
    )
}
