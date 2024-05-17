import React, { useEffect, useState } from "react";
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
  Grid,
  DialogActions,
  IconButton,
  InputAdornment,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { articleService } from "./../services/article_service";

const ArticlesPage = () => {
  const theme = useTheme();

  const [articles, setArticles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteArticle, setDeleteArticle] = useState(null);
  const [editId, setEditId] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [nomError, setNomError] = useState("");
  const [marqueError, setMarqueError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [nom, setNom] = useState("");
  const [marque, setMarque] = useState("");
  const [qte, setQte] = useState(0);

  const [addSnackbarOpen, setAddSnackbarOpen] = useState(false);
  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await articleService.getAllArticles();
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdd = async () => {
    event.preventDefault();
    let isValid = true;
    if (!nom) {
      setNomError("Le nom est requis");
      isValid = false;
    }
    if (!marque) {
      setMarqueError("La marque est requise");
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    const existingArticle = articles.find(
      (article) =>
        article.nomArticle.toLowerCase() === nom.toLowerCase() &&
        article.marqueArticle.toLowerCase() === marque.toLowerCase()
    );

    if (existingArticle) {
      setSnackbarMessage(
        "Un article avec le même nom et la même marque existe déjà."
      );
      setSnackbarOpen(true);
      return;
    }

    const article = {
      nomArticle: nom,
      marqueArticle: marque,
      qteArticle: qte,
    };
    try {
      await articleService.addArticle(article);
      clearForm();
      setDialogOpen(false);
      loadArticles();
      handleAddSnackbarOpen();
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const clearForm = () => {
    setNom("");
    setMarque("");
    setQte(0);
  };

  const handleNomChange = (e) => {
    setNom(e.target.value);
    setNomError("");
  };

  const handleMarqueChange = (e) => {
    setMarque(e.target.value);
    setMarqueError("");
  };

  const openDialog = (mode) => {
    setDialogMode(mode);
    setFormSubmitted(false);
    setDialogOpen(true);
    setNomError("");
    setMarqueError("");
  };

  const closeDialog = () => {
    setDialogOpen(false);
    clearForm();
  };

  const handleDelete = async (code) => {
    try {
      await articleService.deleteArticle(code);
      loadArticles();
      handleDeleteSnackbarOpen();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleEditArticle = (article) => {
    setEditId(article.codeArticle);
    setQte(article.qteArticle);
    setUpdateDialogOpen(true);
  };

  const handleUpdateArticle = async () => {
    event.preventDefault();
    try {
      await articleService.updateArticleQte(editId, qte);
      clearForm();
      setUpdateDialogOpen(false);
      loadArticles();
      handleUpdateSnackbarOpen();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    clearForm();
  };

  const handleAddSnackbarOpen = () => {
    setSnackbarMessage("L'article a été ajouté avec succès.");
    setAddSnackbarOpen(true);
  };

  const handleUpdateSnackbarOpen = () => {
    setSnackbarMessage("La quantité de l'article a été mise à jour avec succès.");
    setUpdateSnackbarOpen(true);
  };

  const handleDeleteSnackbarOpen = () => {
    setSnackbarMessage("L'article a été supprimé avec succès.");
    setDeleteSnackbarOpen(true);
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
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="5px"
          sx={{
            fontWeight: 500,
          }}
        >
          Articles
        </Typography>
        <Button
          onClick={() => openDialog("add")}
          variant="contained"
          sx={{
            backgroundColor:
              theme.palette.mode === "light" ? "#697e87" : "#8fa5ae",
            color: theme.palette.mode === "light" ? "#fff" : "#fff",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light" ? "#596870" : "#7e959f",
            },
          }}
          startIcon={<AddIcon />}
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
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="Rechercher par nom"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchInputChange}
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
              sx={{ width: "300px" }}
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
                .filter((article) => {
                  if (searchTerm === "") {
                    return true;
                  } else {
                    return article.nomArticle
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  }
                })
                .map((article) => (
                  <TableRow key={article.id}>
                    <TableCell align="center">{article.nomArticle}</TableCell>
                    <TableCell align="center">
                      {article.marqueArticle}
                    </TableCell>
                    <TableCell align="center">{article.qteArticle}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEditArticle(article)}
                        aria-label="modifier"
                        sx={{
                          color:
                            theme.palette.mode === "light"
                              ? "#d64000"
                              : "#ffbb6b",
                          "&:hover": {
                            color:
                              theme.palette.mode === "light"
                                ? "#a33109"
                                : "#ff932f",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteArticle(article.codeArticle)}
                        aria-label="supprimer"
                        sx={{
                          color:
                            theme.palette.mode === "light"
                              ? "#d10404"
                              : "#ff0000",
                          "&:hover": {
                            color:
                              theme.palette.mode === "light"
                                ? "#ac0808"
                                : "#d70000",
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
        <DialogTitle>Ajouter un article</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <Grid container spacing={2}>
              <Grid item xs={12} my={1}>
                <TextField
                  fullWidth
                  label="Nom"
                  variant="outlined"
                  error={!!nomError}
                  helperText={marqueError}
                  value={nom}
                  onChange={handleNomChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Marque"
                  variant="outlined"
                  error={!!marqueError}
                  helperText={marqueError}
                  value={marque}
                  onChange={handleMarqueChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantité"
                  variant="outlined"
                  type="number"
                  value={qte}
                  onChange={(e) => setQte(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid
                item
                xs={12}
                container
                justifyContent="flex-end"
                spacing={2}
              >
                <Grid item>
                  <Button
                    onClick={closeDialog}
                    variant="outlined"
                    color="secondary"
                  >
                    Annuler
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Ajouter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={closeUpdateDialog}>
        <DialogTitle>Modifier la quantité</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateArticle}>
            <Grid container spacing={2}>
              <Grid item xs={12} my={1}>
                <TextField
                  fullWidth
                  label="Quantité"
                  variant="outlined"
                  type="number"
                  value={qte}
                  onChange={(e) => setQte(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid
                item
                xs={12}
                container
                justifyContent="flex-end"
                spacing={2}
              >
                <Grid item>
                  <Button
                    onClick={closeUpdateDialog}
                    variant="outlined"
                    color="secondary"
                  >
                    Annuler
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Modifier
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteArticle} onClose={() => setDeleteArticle(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet article ?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteArticle(null)}
            sx={{
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              borderColor: undefined,
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              handleDelete(deleteArticle);
              setDeleteArticle(null);
            }}
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#d10404" : "#d10404",
              color: theme.palette.mode === "light" ? "#fff" : "#fff",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "#ac0808" : "#ac0808",
              },
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={addSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setAddSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setAddSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={updateSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setUpdateSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setUpdateSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={deleteSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setDeleteSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setDeleteSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticlesPage;
