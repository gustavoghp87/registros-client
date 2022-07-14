import { Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'

export const Loading = () => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)

    return (
        <div className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} />
            <br/>
            <br/>
            <span style={{ fontWeight: 'bolder' }}> Cargando... </span>
        </div>
    )
}
