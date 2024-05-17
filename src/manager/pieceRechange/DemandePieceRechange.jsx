import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Dialog,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { demandePRService } from "../../services/demandePR_service";
import { demandeurService } from "../../services/demandeur_service";
import { styled } from "@mui/material/styles";

const DemandePieceRechange = () => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [demandes, setDemandes] = useState({});
  const [demandeurInfos, setDemandeurInfos] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [interCodeToProcess, setInterCodeToProcess] = useState("");
  const [filtreStatut, setFiltreStatut] = useState(""); // état pour le filtre de statutDemande

  const openDialog = (interCode) => {
    setInterCodeToProcess(interCode);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setConfirmationMessage(""); // Réinitialisation de la valeur de ConfirmationMessage lors de la fermeture du dialogue
  };

  const updateDemandesStatut = async (interCode, nouveauStatut) => {
    try {
      console.log("Updating demandes statut...");
      await demandePRService.updateStatut(interCode, nouveauStatut);
      setDemandes((prevDemandes) => ({
        ...prevDemandes,
        [interCode]: prevDemandes[interCode].map((demande) => ({
          ...demande,
          statutDemande: nouveauStatut,
        })),
      }));
      handleSnackbarOpen(`Demandes mises à jour avec succès.`, "success");
    } catch (error) {
      console.error("Error updating demandes statut:", error);
      handleSnackbarOpen(
        `Erreur lors de la mise à jour des demandes.`,
        "error"
      );
    }
  };

  console.log(demandes);

  const processDemande = async (nouveauStatut) => {
    try {
      if (nouveauStatut === "Annuler" || nouveauStatut === "Accepter") {
        await updateDemandesStatut(interCodeToProcess, nouveauStatut);

        const demandeGroup = demandes[interCodeToProcess];
        const updatedDemande = demandeGroup[0]; // On récupère la première demande mise à jour

        if (nouveauStatut === "Accepter") {
          // Check if there are any articles with etat = "Nouveau"
          const hasNewArticles = demandeGroup.some(
            (demande) => demande.etat === "Nouveau"
          );

          if (hasNewArticles) {
            setConfirmationMessage("Il existe des nouveaux articles");
          } else {
            await demandePRService.updateTestQteStock(interCodeToProcess);

            // Fetch the updated demandes after the stock update
            const updatedDemandes = await demandePRService.getAllDemandePR();
            const groupedDemandes = groupDemandesByInterCode(
              updatedDemandes.data
            );
            setDemandes(groupedDemandes);

            const updatedDemande = groupedDemandes[interCodeToProcess][0];
            const distinction = updatedDemande.distingtion; // Get the updated distinction value
            console.log(distinction, "00000");

            const newConfirmationMsg =
              distinction === "consommé"
                ? "Demande traitée avec succès"
                : "Rupture de stock";
            setConfirmationMessage(newConfirmationMsg); // Update ConfirmationMessage with the new value
          }
        }
      } else {
        // Handle other cases if necessary
      }
    } catch (error) {
      console.error("Error processing demande:", error);
      handleSnackbarOpen(`Erreur lors du traitement de la demande.`, "error");
    }
  };

  const handleSnackbarOpen = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#f6f7f8" : "#262626",
    "&:hover": {
      backgroundColor: theme.palette.mode === "light" ? "#dae8ff" : "#333438",
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.mode === "light" ? "#000" : "#fff",
  }));

  const buttonStyles = {
    backgroundColor: "#698b8e",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px 20px",
    fontWeight: "bold",
    textTransform: "none",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#547175",
    },
  };

  const loadAndGroupDemandes = async () => {
    try {
      const response = await demandePRService.getAllDemandePR();
      const groupedDemandes = groupDemandesByInterCode(response.data);
      setDemandes(groupedDemandes);
      const infos = await getAllDemandeurInfos(groupedDemandes);
      setDemandeurInfos(infos);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    loadAndGroupDemandes();
  }, []);

  const groupDemandesByInterCode = (demandes) => {
    const groupedDemandes = {};
    demandes.forEach((demande) => {
      const interCode =
        demande.ticket && typeof demande.ticket === "object"
          ? demande.ticket.interCode
          : demande.ticket;
      if (!groupedDemandes[interCode]) {
        groupedDemandes[interCode] = [];
      }
      groupedDemandes[interCode].push(demande);
    });
    return groupedDemandes;
  };

  const getAllDemandeurInfos = async (demandes) => {
    const infos = {};
    for (const interCode in demandes) {
      const demandeGroup = demandes[interCode];
      const firstDemande = demandeGroup[0];
      const demandeurId = firstDemande.ticket.demandeur;
      try {
        const response = await demandeurService.getDemandeur(demandeurId);
        infos[interCode] = response.data;
      } catch (error) {
        console.error(
          `Error fetching demandeur data for interCode ${interCode}:`,
          error
        );
        infos[interCode] = null;
      }
    }
    return infos;
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme.palette.mode === "light" ? "#f6f6f6" : "#0f0f0f",
        minHeight: "100vh", // Pour s'assurer que le fond s'étend sur toute la hauteur de la vue
      }}
    >
      {" "}
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
          sx={{ fontWeight: 500 }}
        >
          Liste des Demandes des Pièces de Rechange
        </Typography>
        <Box sx={{ marginBottom: "20px", width: 150 }}>
          <FormControl fullWidth>
            <Select
              labelId="filtre-statut-label"
              size="small"
              id="filtre-statut"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              displayEmpty // Pour afficher l'élément vide avec le label
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="Accepter">Acceptées</MenuItem>
              <MenuItem value="Annuler">Annulées</MenuItem>
              <MenuItem value="En attente">En attente</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          padding: "20px",
          borderRadius: "15px",
          flexWrap: "wrap",
          display: "flex",
          gap: "20px",
        }}
      >
        {Object.keys(demandes).map((interCode) => {
          const demandeGroup = demandes[interCode];
          const firstDemande = demandeGroup[0];
          const demandeurInfo = demandeurInfos[interCode];
          let nomSociete = "";
          let nomUtilisateur = "";
          let prenomUtilisateur = "";
          let eqptDesignation = "";

          if (demandeurInfo && demandeurInfo.client) {
            nomSociete = demandeurInfo.client.nomSociete;
            nomUtilisateur = demandeurInfo.user.nom;
            prenomUtilisateur = demandeurInfo.user.prenom;
          } else if (typeof firstDemande.ticket.demandeur === "object") {
            nomSociete = firstDemande.ticket.demandeur.client.nomSociete;
            nomUtilisateur = firstDemande.ticket.demandeur.user.nom;
            prenomUtilisateur = firstDemande.ticket.demandeur.user.prenom;
          }

          if (firstDemande.ticket.equipement) {
            eqptDesignation = firstDemande.ticket.equipement.eqptDesignation;
          }

          // Logique de filtrage
          if (filtreStatut && firstDemande.statutDemande !== filtreStatut) {
            return null; // Si le statut ne correspond pas au filtre, ne pas afficher cette demande
          }

          return (
            <TableContainer
              key={interCode}
              component={Paper}
              sx={{
                backgroundColor:
                  theme.palette.mode === "light" ? "#fff" : "#262626",
                padding: "20px",
                borderRadius: "15px",
                width: 660,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontSize: "24px", fontWeight: "bold" }}
                >
                  {nomSociete}
                  <Box
                    sx={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      ({prenomUtilisateur} {nomUtilisateur})
                    </Typography>
                  </Box>
                </Typography>
                <Typography
  variant="subtitle1"
  sx={{
    fontSize: "18px",
    fontWeight: "bold",
    color:
      theme.palette.mode === "light" ? "#bf5037" : "#f7e8dd",
  }}
>
  {firstDemande.statutDemande === "Accepter"
    ? "Acceptée"
    : firstDemande.statutDemande === "Annuler"
    ? "Annulée"
    : "En attente"}
</Typography>

              </Box>
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ marginBottom: 1 }}
              >
                {eqptDesignation} - {interCode}
              </Typography>
              <Table sx={{ minWidth: 300 }}>
                <TableHead
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light" ? "#f6f7f8" : "#262626",
                  }}
                >
                  <TableRow>
                    <StyledTableCell>Article</StyledTableCell>
                    <StyledTableCell>Quantité</StyledTableCell>
                    <StyledTableCell>Etat</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandeGroup.map((articleDemande, index) => (
                    <StyledTableRow
                      key={index}
                      sx={
                        articleDemande.etat === "Nouveau"
                          ? {
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "#bed8ff"
                                  : "#4f5159",
                            }
                          : null
                      }
                    >
                      <StyledTableCell>
                        {articleDemande.etat === "Ancien"
                          ? articleDemande.article.nomArticle
                          : articleDemande.autreArt}
                      </StyledTableCell>
                      <StyledTableCell>
                        {articleDemande.quantiteDemande}
                      </StyledTableCell>
                      <StyledTableCell>{articleDemande.etat}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              {firstDemande.statutDemande === "En attente" && (
  <Box sx={{ textAlign: "right", marginTop: "10px" }}>
    <Button
      variant="contained"
      sx={buttonStyles}
      onClick={() => openDialog(interCode)}
    >
      Traiter
    </Button>
  </Box>
)}

            </TableContainer>
          );
        })}
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: "20px" }}
          >
            Traitement de la demande
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginBottom: "30px" }}
          ></Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {confirmationMessage === "" ? (
              <>
                <Button
                  onClick={() => processDemande("Accepter")}
                  variant="contained"
                  color="success"
                  sx={{ borderRadius: "20px", padding: "10px 20px" }}
                >
                  Accepter
                </Button>
                <Button
                  onClick={() => {
                    processDemande("Annuler");
                    closeDialog(); // Appel de closeDialog lorsque vous cliquez sur "Annuler"
                  }}
                  variant="contained"
                  color="error"
                  sx={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    marginLeft: "10px",
                  }}
                >
                  Annuler
                </Button>
              </>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography style={{ marginBottom: "20px", fontSize: "16px" }}>
                  {confirmationMessage}
                </Typography>
                <Button
                  onClick={closeDialog}
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    textTransform: "none", // Pour empêcher la transformation du texte en majuscules
                  }}
                >
                  OK
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DemandePieceRechange;
