import { Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../models'

export const Loading = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const mb: string = props.mb
    const mt: string = props.mt
    const white: boolean = props.white
    const big: boolean = props.big

    return (
        <div className={`text-center ${(isDarkMode || !!white) ? 'text-white' : ''}`}
            style={{
                marginBottom: mb,
                marginTop: mt
            }}
        >
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} /> &nbsp; &nbsp;
            <Spinner animation={'grow'} role={'status'} />

            <br/>
            <br/>

            <span style={{ fontWeight: 'bolder', fontSize: big ? '1.3rem' : undefined }}>
                Cargando...
            </span>

        </div>
    )
}
