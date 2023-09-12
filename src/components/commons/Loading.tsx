import { FC } from 'react'
import { Spinner } from 'react-bootstrap'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    mb?: string
    mt?: string
    white?: boolean
    big?: boolean
}

export const Loading: FC<propsType> = ({ big, mb, mt, white }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)

    return (
        <div className={`text-center ${white !== undefined ? white ? 'text-white' : '' : isDarkMode ? 'text-white' : ''}`}
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
