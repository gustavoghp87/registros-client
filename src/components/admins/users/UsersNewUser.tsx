import { ButtonGroup, Container, ToggleButton } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { generalBlue } from '../../../constants'
import { typeRootState } from '../../../models'
import { UsersNewUserCreate } from './UsersNewUserCreate'
import { UsersNewUserInvite } from './UsersNewUserInvite'
import { useSelector } from 'react-redux'

const radios = [
    { name: 'Invitar', value: '1' },
    { name: 'Crear', value: '2' }
]

type propsType = {
    setIsLoading: Dispatch<SetStateAction<boolean>>
    setShowNewUser: Dispatch<SetStateAction<boolean>>
}

export const UsersNewUser: FC<propsType> = ({ setIsLoading, setShowNewUser }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const [confPassword, setConfPassword] = useState("")
    const [email, setEmail] = useState("")
    const [group, setGroup] = useState(0)
    const [password, setPassword] = useState("")
    const [radioValue, setRadioValue] = useState('1')

    return (
        <Container className={'mt-4'} style={{ maxWidth: '400px' }}>

            <ButtonGroup className={'w-100 mt-3 mb-2'}>
                {radios.map((radio, idx) => (
                    <ToggleButton key={idx}
                        id={`radio-${idx}`}
                        type={'radio'}
                        className={radioValue === radio.value ? '' : 'bg-secondary'}
                        style={{ backgroundColor: radioValue === radio.value ? generalBlue : undefined }}
                        checked={radioValue === radio.value}
                        value={radio.value}
                        onChange={e => setRadioValue(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>

            {radioValue === '1' ?
                <UsersNewUserInvite
                    email={email}
                    isDarkMode={isDarkMode}
                    setEmail={setEmail}
                    setIsLoading={setIsLoading}
                    setShowNewUser={setShowNewUser}
                />
                :
                <UsersNewUserCreate
                    confPassword={confPassword}
                    email={email}
                    group={group}
                    isDarkMode={isDarkMode}
                    password={password}
                    setConfPassword={setConfPassword}
                    setEmail={setEmail}
                    setGroup={setGroup}
                    setIsLoading={setIsLoading}
                    setPassword={setPassword}
                    setShowNewUser={setShowNewUser}
                />
            }

        </Container>
    )
}
