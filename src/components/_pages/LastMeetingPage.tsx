//import { HTMLAttributeReferrerPolicy } from "react"


export const LastMeetingPage = () => {

    //const referrerPolicy: HTMLAttributeReferrerPolicy = 'unsafe-url'

    return (
        <div className={'mt-4'}>
            <br/>
            <br/>
            {/* <iframe
                allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;`}
                frameBorder={'0'}
                height={'700px'}
                referrerPolicy={'unsafe-url'}
                src={'https://www.youtube.com/embed/J2ToaJoHWII?autoplay=1'}
                title={"Última Reunión"}
                width={'100%'}
            /> */}

            <iframe
                allow={'autoplay'}
                className={'mt-3 mb-5 animate__animated animate__bounceInLeft animate__faster'}
                height={'800px'}
                src={'https://drive.google.com/file/d/1Rci2zSpj7x2K-O65FVhXIf5kI8eXIjDj/preview'}
                style={{ background: 'lightgray center center no-repeat' }}
                title={'31 de agosto 2022'}
                width={'100%'}
            />
        </div>
    )
}
