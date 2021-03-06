
export const timeConverter = (UNIX_timestamp:string, parse:boolean) => {

    try {
        let a:Date;
        if (parse) a = new Date(parseInt(UNIX_timestamp))
        else a = new Date(UNIX_timestamp)
        let months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
        let year = a.getFullYear()
        let month = months[a.getMonth()]
        let date = a.getDate()
        let hour = a.getHours()
        let min = a.getMinutes()<10? "0" + a.getMinutes() : a.getMinutes()
        let time = date + ' ' + month + ' ' + year + ' - ' + hour + ':' + min + ' hs'
        return time
    } catch {return "No se pudo recuperar la fecha..."}
}

export const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)


export const colocarGuiones = (tel:number) => {
    let tel2:string
    if (tel.toString()[0]==='1') tel2 = tel.toString().slice(0,2) + "-" + tel.toString().slice(2,6) + "-" + tel.toString().slice(-4)
    else tel2 = tel.toString().slice(0,3) + "-" + tel.toString().slice(3,6) + "-" + tel.toString().slice(-4)
    return tel2
}
