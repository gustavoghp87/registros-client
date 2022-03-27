import { useDispatch, useSelector } from 'react-redux'
import { changeDarkModeReducer } from '../../store/DarkModeSlice'
import { typeAppDispatch, typeRootState } from '../../store/store'

export const DarkModeButton = () => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
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
