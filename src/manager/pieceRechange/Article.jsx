import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TableFooter,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import Header from "../../components/Header";

const ArticlesPage = () => {
  const theme = useTheme();

  const [articles, setArticles] = useState([
    { id: 1, nom: "Article 1", marque: "Marque 1", quantite: 10 },
    { id: 2, nom: "Article 2", marque: "Marque 2", quantite: 20 },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedArticle, setSelectedArticle] = useState({
    id: null,
    nom: "",
    marque: "",
    quantite: 0,
  });

  const [nomError, setNomError] = useState(false);
  const [marqueError, setMarqueError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false); // État pour suivre la soumission du formulaire

  const [searchTerm, setSearchTerm] = useState("");

  const openDialog = (mode, article = null) => {
    setDialogMode(mode);
    setSelectedArticle(
      article
        ? article
        : {
            id: null,
            nom: "",
            marque: "",
            quantite: 0,
          }
    );
    setNomError(false);
    setMarqueError(false);
    setFormSubmitted(false); // Réinitialiser l'état de soumission du formulaire
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm(e.target.value);
    setSelectedArticle({ ...selectedArticle, [name]: value });

    // Si le champ a déjà une erreur et que l'utilisateur commence à écrire dedans, réinitialiser l'état d'erreur
    if ((name === "nom" && nomError) || (name === "marque" && marqueError)) {
      setNomError(name === "nom" ? false : nomError);
      setMarqueError(name === "marque" ? false : marqueError);
    }
  };

  const handleFormSubmit = () => {
    if (selectedArticle.nom && selectedArticle.marque) {
      if (dialogMode === "add") {
        const newArticle = {
          id: articles.length + 1,
          ...selectedArticle,
        };
        setArticles([...articles, newArticle]);
      } else if (dialogMode === "edit") {
        const updatedArticles = articles.map((article) =>
          article.id === selectedArticle.id ? selectedArticle : article
        );
        setArticles(updatedArticles);
      }
      setDialogOpen(false);
    } else {
      setNomError(!selectedArticle.nom);
      setMarqueError(!selectedArticle.marque);
      setFormSubmitted(true); // Marquer le formulaire comme soumis pour garder les erreurs affichées
    }
  };

  const openDialogDelete = (article) => {
    setSelectedArticle(article);
    setDialogMode("delete");
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedArticle) {
      const updatedArticles = articles.filter(
        (article) => article.id !== selectedArticle.id
      );
      setArticles(updatedArticles);
      closeDialog(); // Fermer la boîte de dialogue après la suppression
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // Ajout de cette ligne pour aligner verticalement les éléments
          marginBottom: 2,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="5px"
          sx={{
            fontWeight: 500, // épaisseur de la police
          }}
        >
          Articles
        </Typography>
        <Button
          onClick={() => openDialog("add")}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.mode === 'light' ? '#697e87' : '#8fa5ae',
            color: theme.palette.mode === 'light' ? '#fff' : '#fff',
            '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#596870' : '#7e959f',
              },
          }}          startIcon={<AddIcon />}
        >
          Ajouter un article
        </Button>
      </Box>

      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Ajout de cette ligne pour aligner verticalement les éléments
            marginBottom: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="Rechercher par nom"
              variant="outlined"
              value={searchTerm}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={() => setSearchTerm("")}
                      edge="end"
                    >
                      {searchTerm && <ClearIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: "300px" }} // Ajoutez cette ligne pour définir une largeur fixe
            />
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Nom</TableCell>
                <TableCell align="center">Marque</TableCell>
                <TableCell align="center">Quantité</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles
                .filter((article) =>
                  article.nom.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((article) => (
                  <TableRow key={article.id}>
                    <TableCell align="center">{article.nom}</TableCell>
                    <TableCell align="center">{article.marque}</TableCell>
                    <TableCell align="center">{article.quantite}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => openDialog("edit", article)}
                        aria-label="modifier"
                        sx={{
                            color: theme.palette.mode === 'light' ? '#d64000' : '#ffbb6b',
                            '&:hover': {
                                color: theme.palette.mode === 'light' ? '#a33109' : '#ff932f',
                              },
                          }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openDialogDelete(article)}
                        aria-label="supprimer"
                        sx={{
                            color: theme.palette.mode === 'light' ? '#d10404' : '#ff0000',
                            '&:hover': {
                                color: theme.palette.mode === 'light' ? '#ac0808' : '#d70000',
                              },
                          }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {dialogMode === "add"
            ? "Ajouter un article"
            : dialogMode === "delete"
            ? "Supprimer l'article"
            : "Modifier l'article"}
        </DialogTitle>
        {dialogMode === "delete" && selectedArticle && (
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer l'article{" "}
              <strong>{selectedArticle.nom}</strong> ?
            </Typography>
          </DialogContent>
        )}
        {dialogMode !== "delete" && (
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom"
              type="text"
              fullWidth
              name="nom"
              value={selectedArticle.nom}
              onChange={handleInputChange}
              required
              error={nomError}
              helperText={
                nomError ? "Veuillez saisir le nom de l'article." : ""
              }
            />
            <TextField
              margin="dense"
              label="Marque"
              type="text"
              fullWidth
              name="marque"
              value={selectedArticle.marque}
              onChange={handleInputChange}
              required
              error={marqueError}
              helperText={
                marqueError ? "Veuillez saisir la marque de l'article." : ""
              }
            />
            <TextField
              margin="dense"
              label="Quantité"
              type="number"
              fullWidth
              name="quantite"
              value={selectedArticle.quantite}
              onChange={handleInputChange}
            />
          </DialogContent>
        )}
        <DialogActions>
  <Button onClick={closeDialog} sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000', borderColor: dialogMode === 'delete' ? theme.palette.error.main : undefined }}>
    Annuler
  </Button>
  {dialogMode === "delete" ? (
    <Button onClick={handleDelete} sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#d10404' : '#d10404',
        color: theme.palette.mode === 'light' ? '#fff' : '#fff',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'light' ? '#ac0808' : '#ac0808',
          },
      }}>
      Supprimer
    </Button>
  ) : (
    <Button onClick={handleFormSubmit} color="primary">
      {dialogMode === "add" ? "Ajouter" : "Modifier"}
    </Button>
  )}
</DialogActions>

      </Dialog>
    </Box>
  );
};

export default ArticlesPage;
