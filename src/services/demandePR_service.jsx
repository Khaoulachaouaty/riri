import Axios from "./caller_service";

let getAllDemandePR = () => {
    return Axios.get('/tickets/api/allRequests')
}

let addDemandePR = (addItem) => {
    return Axios.post('/tickets/api/addPieceRequest',addItem)
}


let updateStatut = (interCode, nouveauStatus) => {
  return Axios.put(`/tickets/api/updateStatutDemande/${interCode}`, null, {
      params: {
          newStatutDemande: nouveauStatus
      }
  });
}

let updateTestQteStock = (interCode) => {
  return Axios.put('/tickets/api/updateQuantiteStock/'+interCode)
}

let updateChampDone = (interCode) => {
    return Axios.put('/tickets/api/updateChampDone/'+interCode)
}

let updateChapNonDone = (interCode) => {
    return Axios.put('/tickets/api/updateChapNonDone/'+interCode)
}

export const demandePRService = {
    addDemandePR, getAllDemandePR, updateStatut, updateTestQteStock, updateChampDone, updateChapNonDone
}