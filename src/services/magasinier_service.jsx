import Axios from "./caller_service";

let getAllMagasiniers = () => {
    return Axios.get('/tickets/api/allMagasiniers')
}


export const magasinierService = {
    getAllMagasiniers, 
}