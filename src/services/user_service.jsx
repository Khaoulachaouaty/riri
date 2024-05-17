import Axios from "./caller_service";

let getAllUsers = () => {
    return Axios.get('tickets/allUsers')
}

let deleteUSer = (selectedRowId) => {
    return Axios.delete('tickets/delUser/'+selectedRowId);
}

let creerUser = (user) => {
    return Axios.post('/tickets/register',user);
}

export const userService = {
    getAllUsers, deleteUSer, creerUser, 
}