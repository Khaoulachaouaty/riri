import Axios from "./caller_service"


//   Sauvegarde du token dans le localStorage
//   @param {string} token 
let saveToken = (token) => {
    console.log(token)
    localStorage.setItem('token', token)
}


//   Suppression du token du localStorage
let logout = () => {
    localStorage.removeItem('token')
}


//   Etat de la présence d'un token en localStorage
//   @returns {boolean}
let isLogged = () => {
    let token = localStorage.getItem('token')
    return !!token
}


//   Connexion vers l'API
//   @param {object} credentials 
//   @returns {Promise}
let login = (connect) => {
    return Axios.post('tickets/login', connect)
}

let getToken = () => {
    return localStorage.getItem('token')
}

export const Account_service ={
     login,saveToken, logout, isLogged, getToken
}