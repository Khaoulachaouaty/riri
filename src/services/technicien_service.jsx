import Axios from "./caller_service";

let getAllTechniciens = () => {
    return Axios.get('/tickets/api/allTechniciens')
}

let getTechByDep = (codeDepart) => {
    return Axios.get('/tickets/api/getTechDepart/'+codeDepart)
}

export const technicienService = {
    getAllTechniciens, getTechByDep,
}