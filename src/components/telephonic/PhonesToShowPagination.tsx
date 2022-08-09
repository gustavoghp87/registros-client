import { Pagination } from 'react-bootstrap'

export const PhonesToShowPagination = (props: any) => {

    const isShowingAllStates: boolean = props.isShowingAllStates
    const setBrought: Function = props.setBrought
    const setBroughtAllHandler: Function = props.setBroughtAllHandler

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
