import Axios from "./caller_service";

let getAllManagers = () => {
    return Axios.get('/tickets/api/allManagers')
}


export const managerService = {
    getAllManagers, 
}