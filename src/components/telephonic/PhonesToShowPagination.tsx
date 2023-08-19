import { Dispatch, FC, SetStateAction } from 'react'
import { Pagination } from 'react-bootstrap'

type propsType = {
    isShowingAllStates: boolean
    setBrought: Dispatch<SetStateAction<number>>
    setBroughtAllHandler: () => void
}

export const PhonesToShowPagination: FC<propsType> = ({ isShowingAllStates, setBrought, setBroughtAllHandler }) => {

    return (
        <Pagination size={'lg'}
            className={'text-center align-items-center justify-content-center'}
            style={{
                fontWeight: 'bolder',
                marginTop: '80px'
            }
        }>
            <Pagination.Item onClick={() => setBrought((x: number) => x + 10)}>
                Mostrar 10 más
            </Pagination.Item>

            <Pagination.Item onClick={() => setBroughtAllHandler()}>
                Ver todos {!isShowingAllStates && <span>los no predicados</span>}
            </Pagination.Item>
        </Pagination>
    )
}
