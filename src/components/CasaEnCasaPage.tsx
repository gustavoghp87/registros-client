import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Button, Container } from 'react-bootstrap'
import { ReturnBtn } from './_Return'
import { Loading } from './_Loading'
import { RefreshButton } from './blocks/RefreshButton'
//import io from 'socket.io-client'
import { H2 } from './css/css'
import { isMobile } from '../services/functions'
//import { Col0a } from './columns/Col0a'
//import { Col0b } from './columns/Col0b'
import { BsToaster } from './columns/BsToaster'
import { NewHouseholdModal } from './blocks/NewHouseholdModal'
import { getBuildingsService, getTerritoryStreetsService } from '../services/houseToHouseServices'
//import { typeUser } from '../models/typesUsuarios'
import { typeHTHBuilding } from '../models/houseToHouse'
import { HTHStreetCard } from './blocks/HTHStreetCard'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const CasaEnCasaPage = (props: any) => {
    
    const { territory } = useParams<any>()
    //const user: typeUser = props.user
    const [buildings, setBuildings] = useState<typeHTHBuilding[]>([])
    const [streets, setStreets] = useState<string[]>([])
    const [isFinished, setIsFinished] = useState<boolean>(false)
    //const [brought, setBrought] = useState<number>(10)
    //const [broughtAll, setBroughtAll] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    //const [blocks, setBlocks] = useState<string[]>(['1', '2', '3'])
    //const [textBtn, setTextBtn] = useState<string>('Traer 10 más')
    //const [socket, setSocket] = useState<any>(null)
    
    const [showMap, setShowMap] = useState<boolean>(true)
    const [showAddHousehold, setShowAddHousehold] = useState<boolean>(false)
    
    //const manzana = "1"
    //const showingAll = true

    useEffect(() => {
        window.scrollTo(0, 0)
        if (territory && !streets.length) getTerritoryStreetsService(territory)
            .then((streets: string[]|null) => {
                if (!streets || !streets.length) return
                setStreets(streets)
            })
        if ((!buildings || !buildings.length) && territory) {
            setLoading(true)
            getBuildingsService(territory).then((buildings: typeHTHBuilding[]|null) => {
                if (buildings) setBuildings(buildings)
                console.log(buildings)
                setLoading(false)
                setIsFinished(false)
            })
        }
    }, [territory, buildings, streets])

    const showAddHouseholdModalHandler = (show: boolean): void => setShowAddHousehold(show)
    

    return (
    <>
        {ReturnBtn()}

        <RefreshButton />

        <H2 style={{ fontSize: isMobile ? '2.2rem' : '' }}> CASA EN CASA </H2>

        <BsToaster />

        <h1 style={{
            textAlign: 'center',
            margin: isMobile ? '80px auto 20px auto' : '60px auto 40px auto',
            fontSize: isMobile ? '2.3rem' : '2.8rem',
            fontWeight: 'bolder'
        }}>
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


        {/* <Col0a
            territorio={territory}
            manzanas={blocks}
            manzana={manzana}
        /> */}

        {/* <Col0b
            user={user}
            territorio={territory}
            manzana={manzana}
            isTodo={showingAll}
        /> */}

        {/* <Button size={isMobile ? 'sm' : 'lg'}
            onClick={() => {}}
            style={{
                backgroundColor: '#4a6da7',
                border: '1px solid #4a6da7',
                borderRadius: '5px',
                display: isFinished ? 'none' : 'block',
                margin: 'auto',
                marginBottom: '50px',
                fontSize: 15
            }}
        >
            Marcar este territorio como terminado
        </Button> */}

        {/* <Button size={isMobile ? 'sm' : 'lg'}
            onClick={() => {}}
            style={{
                backgroundColor: 'red',
                border: '1px solid red',
                borderRadius: '5px',
                display: isFinished ? 'block' : 'none',
                margin: 'auto',
                marginBottom: '50px',
                fontSize: 15
            }}
        >
            Desmarcar este territorio como terminado
        </Button> */}


        <Container fluid={'lg'} className={'mb-2'} style={{ marginTop: '60px' }}>
            <Button className={'btn btn-danger btn-block w-100 p-3'}
                onClick={() => setShowAddHousehold(!showAddHousehold)}
            >
                + Agregar edificio
            </Button>
        </Container>

        <br />
        <hr style={{ border: '1px solid black' }} />

        
        <NewHouseholdModal
            showHandler={showAddHouseholdModalHandler}
            show={showAddHousehold}
            territory={territory}
        />


        {streets && !!streets.length && streets.map((street: string, index: number) =>
            <HTHStreetCard
                street={street}
                buildings={buildings}
                index={index}
            />
        )}


        {/* {householdsObj && householdsObj.households && !!householdsObj.households.length && loaded &&
        <>
            <Pagination size='lg' style={{ textAlign: 'center',
                alignItems: 'center', justifyContent: 'center', marginTop: '80px', fontWeight: 'bolder',
                display: broughtAll ? 'none' : ''
            }}>
                <Pagination.Item onClick={() => getTenMoreHandler()}>
                    {textBtn}
                </Pagination.Item>

                <Pagination.Item onClick={() => setBroughtAll(true)}>
                    Traer todos
                </Pagination.Item>
            </Pagination>
        </>
        } */}

        {buildings && !buildings.length && loading &&
            <>
                <br/>
                <Loading />
            </>
        }

        {loading &&
            <>
                <br/>
                <Loading />
            </>
        }

        {/* {householdsObj && householdsObj.households && !householdsObj.households.length && !showingAll && loaded &&
            <h3 style={{ textAlign: 'center' }}>
                <br/>
                No hay viviendas no llamadas en esta manzana {manzana} del territorio {territory}
            </h3>
        } */}
    </>
    )
}
