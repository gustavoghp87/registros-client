import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Button, Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { Loading } from './commons/Loading'
import { useAuth } from '../context/authContext'
import io from 'socket.io-client'
import { SERVER } from './../config'
import { H2 } from './css/css'
import { TerritoryWarningToaster } from './territory-components/TerritoryWarningToaster'
import { HTHHouseholdModal } from './house-to-house/HTHHouseholdModal'
import { HTHStreetCard } from './house-to-house/HTHStreetCard'
import { getBuildingsService, getTerritoryStreetsService } from '../services/houseToHouseServices'
import { typeUser } from '../models/user'
import { typeHTHBuilding, typeHTHHousehold } from '../models/houseToHouse'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const CasaEnCasaPage = () => {
    
    const { territory } = useParams<any>()
    const user: typeUser|undefined = useAuth().user
    const [buildings, setBuildings] = useState<typeHTHBuilding[]>([])
    const [streets, setStreets] = useState<string[]>([])
    const [isFinished, setIsFinished] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [showMap, setShowMap] = useState<boolean>(true)
    const [showAddHousehold, setShowAddHousehold] = useState<boolean>(false)
    const [socket, setSocket] = useState<any>(null)
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    useEffect(() => {
        //window.scrollTo(0, 0)
        if (territory && !streets.length) getTerritoryStreetsService(territory)
            .then((streets: string[]|null) => {
                if (!streets || !streets.length) return
                setStreets(streets.sort())
            })
        if ((!buildings || !buildings.length) && territory) {
            setLoading(true)
            getBuildingsService(territory).then((buildings: typeHTHBuilding[]|null) => {
                if (buildings) setBuildings(buildings)
                setLoading(false)
                setIsFinished(false)
            })
        }
        if (!socket) {
            const newSocket = io(SERVER, { withCredentials: true })
            newSocket.on('hth: change', (updatedBuildings: typeHTHBuilding[]) => {
                console.log("Recibido:", updatedBuildings);
                if (territory === updatedBuildings[0].territory) setBuildings(updatedBuildings)
            })
            if (newSocket) setSocket(newSocket)
        }
        if (socket && !socket.connected) { console.log("Sin conectar") } else { console.log("Conectado") }
        return () => { }
    }, [territory, streets, buildings, socket, socket?.connected])

    const closeHTHModalHandler = (): void => setShowAddHousehold(false)

    const sendUpdateBySocket = (updatedHousehold: typeHTHHousehold, buildingId: string): void => {
        for (let i = 0; i < buildings.length; i++) {
            if (buildings[i]._id === buildingId) for (let j = 0; j < buildings[i].households.length; j++) {
                if (buildings[i].households[j].idNumber === updatedHousehold.idNumber) buildings[i].households[j] = updatedHousehold
            }
        }
        console.log("Enviando:", buildings);
        
        if (socket && socket.connected && buildings) socket.emit('hth: change', buildings)
        else alert("Hay un problema de conexión; refrescar")
    }
    

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.2rem' : '' }}>
            CASA EN CASA - {user?.email}
        </H2>

        <TerritoryWarningToaster />

        <h1 className={isDarkMode ? 'text-white' : ''}
            style={{
                textAlign: 'center',
                margin: isMobile ? '80px auto 20px auto' : '60px auto 40px auto',
                fontSize: isMobile ? '2.3rem' : '2.8rem',
                fontWeight: 'bolder'
            }}
        >
            TERRITORIO {territory} {isFinished ? `- TERMINADO` : ``} 
        </h1>


        <Button variant={'dark'}
            onClick={() => setShowMap(!showMap)}
            style={{ display: 'block', margin: '22px auto' }}
        >
            {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
        </Button>


        <img src={`/img/${territory}.jpg`} alt={'map'}
            style={{
                border: '1px solid black',
                borderRadius: '8px',
                width: isMobile ? '99%' : '40%',
                height: 'auto',
                display: showMap ? 'block' : 'none',
                margin: '30px auto',
                padding: isMobile ? '10px' : '20px'
            }}
        />


        <Container fluid={'lg'} className={'mb-2'} style={{ marginTop: '60px' }}>
            <Button className={'btn btn-danger btn-block w-100 p-3 text-uppercase'}
                onClick={() => setShowAddHousehold(!showAddHousehold)}
            >
                + Agregar edificio
            </Button>
        </Container>

        <HTHHouseholdModal
            closeHTHModalHandler={closeHTHModalHandler}
            showModal={showAddHousehold}
            streets={streets}
            territory={territory}
        />

        <br />
        <hr style={{ border: '1px solid black' }} />



        {streets && !!streets.length && streets.map((street: string, index: number) =>
            <HTHStreetCard
                key={index}
                buildings={buildings}
                sendUpdateBySocket={sendUpdateBySocket}
                street={street}
                streets={streets}
            />
        )}

        {loading &&
            <>
                <br/>
                <Loading />
            </>
        }

    </>
    )
}
