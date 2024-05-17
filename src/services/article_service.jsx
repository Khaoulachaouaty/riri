import Axios from "./caller_service";

let getAllArticles = () => {
    return Axios.get('/tickets/api/allArticle')
}

let addArticle = (addItem) => {
    return Axios.post('/tickets/api/addArticle',addItem)
}


let deleteArticle = (deleteItem) => {
    return Axios.delete('/tickets/api/delArticle/'+deleteItem)
}

let updateArticleQte = (id, newQte) => {
  return Axios.put(`/tickets/api/updateQuantity/${id}`, { qteArticle: newQte });
};

  
export const articleService = {
    getAllArticles, addArticle, deleteArticle, updateArticleQte
}