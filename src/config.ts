
const local = false

export let SERVER: string
if (local) SERVER = "http://localhost:4005"
else SERVER = "https://registros-rest-api.herokuapp.com"

console.log(SERVER)
