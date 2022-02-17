import { isMobile } from "../../services/functions"


export const BgColorButton = (props: any) => {

    const { darkMode, changeDarkMode } = props

    return (
        <div className={'custom-control custom-switch'} style={{ position: 'fixed', bottom: '20px' }}>
            <input className={'custom-control-input'}
                type={'checkbox'}
                id={"customSwitches"}
                checked={darkMode}
                onChange={() => changeDarkMode()}
            />
            <label className={'custom-control-label'}
                htmlFor={'customSwitches'}
                style={{ color: darkMode ? 'white' : 'red' }}
            >
                <b> {isMobile ? '' : (darkMode ? 'Modo Claro' : 'Modo Oscuro')} </b>
            </label>
        </div>
    )
}
