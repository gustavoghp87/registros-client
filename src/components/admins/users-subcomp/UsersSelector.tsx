import { ButtonGroup, Card, Dropdown, DropdownButton, Form } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction } from 'react'
import { typeRootState, typeUser } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    selectedGroup: number
    setEmailSearchInputText: Dispatch<SetStateAction<string>>
    setSelectedGroup: Dispatch<SetStateAction<number>>
    usersToShow: typeUser[]|null
}

export const UsersSelector: FC<propsType> = ({
    selectedGroup, setEmailSearchInputText, setSelectedGroup, usersToShow
}) => {
    const isDarkMode = useSelector((state: typeRootState) => state.user)

    return (
        <Card
            className={`mx-auto text-center ${isDarkMode ? 'bg-dark text-white' : ''}`}
            style={{ backgroundColor: '#f6f6f8', marginTop: '70px', maxWidth: '500px' }}
        >
            <Card.Body>
                
                <Card.Title className={'mt-4 mb-2'}>
                    <h1>Mostrando {usersToShow?.length || 0} </h1>
                </Card.Title>

                <div className={'row w-100 mx-0'}>
                    <div className={'col-sm-6'}>
                        <Card.Title className={'mt-4 mb-3'}>
                            Buscar por correo:
                        </Card.Title>
                        <Form.Control
                            autoFocus
                            className={'d-block mx-auto mb-4'}
                            onChange={e => setEmailSearchInputText(e.target.value?.toLowerCase() || "")}
                            placeholder={"Buscar por email"}
                            style={{ maxWidth: '300px' }}
                            type={'email'}
                        />
                    </div>

                    <div className={'col-sm-6'}>
                        <Card.Title className={'mt-4 mb-3'}>
                            Buscar por grupo:
                        </Card.Title>
                        <DropdownButton
                            as={ButtonGroup}
                            className={'d-block mx-auto text-center mb-4'}
                            id={'adminsPageDropdownBtn'}
                            title={`Viendo ${selectedGroup ? `Grupo ${selectedGroup}` : 'todos'}`}
                        >
                            <Dropdown.Item eventKey={'0'} onClick={() => setSelectedGroup(0)} active={selectedGroup === 0}> Ver todos </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey={'1'} onClick={() => setSelectedGroup(1)} active={selectedGroup === 1}> Grupo 1 </Dropdown.Item>
                            <Dropdown.Item eventKey={'2'} onClick={() => setSelectedGroup(2)} active={selectedGroup === 2}> Grupo 2 </Dropdown.Item>
                            <Dropdown.Item eventKey={'3'} onClick={() => setSelectedGroup(3)} active={selectedGroup === 3}> Grupo 3 </Dropdown.Item>
                            <Dropdown.Item eventKey={'4'} onClick={() => setSelectedGroup(4)} active={selectedGroup === 4}> Grupo 4 </Dropdown.Item>
                            <Dropdown.Item eventKey={'5'} onClick={() => setSelectedGroup(5)} active={selectedGroup === 5}> Grupo 5 </Dropdown.Item>
                            <Dropdown.Item eventKey={'6'} onClick={() => setSelectedGroup(6)} active={selectedGroup === 6}> Grupo 6 </Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}
