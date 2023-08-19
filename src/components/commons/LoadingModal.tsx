import { Loading } from './'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

export const LoadingModal = () => {
    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))

    return (
        <div className={'bg-opacity bg-danger'}
            style={{
                height: '150px',
                marginTop: `calc(100vh - ${isMobile ? '190px' : '250px'})`,
                position: 'relative',
                paddingTop: '40px',
                width: '100%',
                zIndex: 10
            }}
        >
            <Loading big={true} />
        </div>
    )
}
