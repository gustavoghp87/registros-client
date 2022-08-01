import { useSelector } from 'react-redux'
import { MdDelete, MdEdit } from 'react-icons/md'
import { typeRootState } from '../../../models'

export const HTHItemCard = (props: any) => {

    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const date: string = props.date
    const deleteHandler: Function = props.deleteHandler
    const editHandler: Function = props.editHandler
    const text: string = props.text

    return (
        <div className={`my-4 text-center bg-dark text-white d-block mx-auto`}
            style={{
                border: isDarkMode ? '1px solid white' : '1px solid lightgray',
                borderRadius: '7px',
                maxWidth: '500px',
                padding: isMobile ? '15px' : '25px 50px 15px 50px'
            }}
        >
            {isMobile ? <small> Fecha: {date} </small> : <h5 className={'mb-3'}> Fecha: {date} </h5>}

            <h3 className={'mt-2 mb-4'}>
                {text}
            </h3>

            {user && user.isAdmin && <>

                {editHandler &&
                    <div className={'mt-1 mb-2 py-1 pointer'} style={{ border: '1px solid lightgray', borderRadius: '5px' }}
                        onClick={() => editHandler()}
                    >
                        <h4 className={'d-inline'}>
                            Editar &nbsp;
                        </h4>
                        <MdEdit className={'d-inline align-top'} size={isMobile ? '1.4rem' : '1.8rem'} />
                    </div>
                }

                <div className={'mt-1 mb-2 py-1 pointer'} style={{ border: '1px solid lightgray', borderRadius: '5px' }}
                    onClick={() => deleteHandler()}
                >
                    <h4 className={'d-inline'}>
                        Eliminar &nbsp;
                    </h4>
                    <MdDelete className={'d-inline align-top'} size={isMobile ? '1.4rem' : '1.8rem'} />
                </div>

            </>}
        </div>
    )
}
