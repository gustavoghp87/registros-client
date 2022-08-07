//import { HTMLAttributeReferrerPolicy } from "react"


export const LastMeetingPage = () => {

    //const referrerPolicy: HTMLAttributeReferrerPolicy = 'unsafe-url'

    return (
        <div className={'mt-4'}>
            <br/>
            <br/>
            <iframe
                allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; autoplay;`}
                frameBorder={'0'}
                height={'700px'}
                referrerPolicy={'unsafe-url'}
                src={'https://www.youtube.com/embed/J2ToaJoHWII' + '?autoplay=1'}
                title={"Última Reunión"}
                width={'100%'}
            />
        </div>
    )
}
