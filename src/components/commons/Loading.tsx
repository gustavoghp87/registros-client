import { Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../models'

export const Loading = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const mb: number = props.mb || 0
    const mt: number = props.mt || 0

    return (
        <div className={`text-center ${isDarkMode ? 'text-white' : ''}`} style={{ marginBottom: `${mb*5}px`, marginTop: `${mt*5}px` }}>
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
