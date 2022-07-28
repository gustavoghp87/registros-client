import { H2, SideBar } from '../commons'

export const CongregationPage = () => {

    // data-embed-doc-id="

    const ids = {
        anunciosYCartas: ["1xkPvTkuZDWbJr93crzD1t6ca1O7L7Yqf", "1r-tH9IClOR-kFyrI5GkR1TIQqwehF9pJ", "1y2ByTUWhP7dIoukbCMAp5E5VkqN-Tfzv", "1iptV_ikuitFHJ6Sx1AAXLiy_Q3gVD4cB"],
        programaDeReuniones: ["1oY5e7lbgyqjLmdIjw4NHn9p05K2UX4Gi", "198BUsd2Gls8QMZcsS5TP0siIQdJrVh7n", "1JlHHRcV2oYRPMhCX06DUXqgWESV5LxBy", "1RaVulqE6QQJurCSSpRO72yAU8bQktZKe"]
    }

    if (!ids) return (<h1> Failed </h1>)

    return (
        <div>
            <div style={{ padding: '50px 0px 0px 370px' }}>
                <SideBar />
            </div>

            <H2 title={"Anuncios y Cartas"} />
            {ids.anunciosYCartas && !!ids.anunciosYCartas.length && ids.anunciosYCartas.map((id: string) =>
                <iframe
                    allow={'autoplay'}
                    height={'700px'}
                    key={id}    
                    src={`https://drive.google.com/file/d/${id}/preview`}
                    title={"Predicación"}
                    width={'100%'}
                />
            )}

            <H2 title={"Programa de reuniones"} />
            {ids.anunciosYCartas && !!ids.programaDeReuniones.length && ids.programaDeReuniones.map((id: string) =>
                <iframe
                    allow={'autoplay'}
                    height={'700px'}
                    key={id}
                    src="https://drive.google.com/file/d/1gp97oxqinhHULS_zDBx7_56F1oNyXQsJ/preview"
                    title={"Sonido"}
                    width={'100%'}
                />
            )}

            
        </div>
    )
}
