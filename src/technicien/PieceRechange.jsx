import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
  useTheme,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "./../components/Header";
import { pieceRechangeService } from "./../services/pieceRechange_service";
import { useLocation } from "react-router-dom";
import { ticketService } from "./../services/ticke_servicet"; // Correction du nom d'import
import { demandePRService } from "./../services/demandePR_service"; // Correction du nom d'import

const DemandePieceForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ticketId = searchParams.get("ticketId");

  const [demande, setDemande] = useState([{ nomArticle: "", qteUE: "" }]);
  const [piecesManuelles, setPiecesManuelles] = useState([]);
  const theme = useTheme();
  const [piece, setPiece] = useState({});
  const [pieces, setPieces] = useState([]);
  const [ticket, setTicket] = useState({});
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(-1);
  const [equipments, setEquipments] = useState([]);

  console.log("demande", demande);
  console.log("manuelle", piecesManuelles);

  const loadPieces = async () => {
    try {
      const response = await pieceRechangeService.getAllPieceRechange();
      setPieces(response.data);
    } catch (error) {
      console.error("Error fetching piece de rechange data:", error);
    }
  };

  const loadTicket = async () => {
    try {
      const response = await ticketService.getTicket(ticketId);
      setTicket(response.data);
      setEquipments([response.data.equipement]);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    loadPieces();
    loadTicket();
  }, []);

  const handleQteUEChange = (index, value) => {
    const newDemande = [...demande];
    newDemande[index].qteUE = value;
    setDemande(newDemande);
    setSelectedPieceIndex(index);
  };

  const handleChangeNomArticle = (index, value) => {
    setPiecesManuelles((prev) => {
      const newArr = [...prev];
      newArr[index].nomArticle = value;
      return newArr;
    });
  };

  const handleChangeQteUE = (index, value) => {
    setPiecesManuelles((prev) => {
      const newArr = [...prev];
      newArr[index].qteUE = value;
      return newArr;
    });
  };

  const addDemande = () => {
    setDemande((prevDemande) => [
      ...prevDemande,
      { nomArticle: "", qteUE: "" },
    ]);
  };

  const addPieceManuelle = () => {
    setPiecesManuelles((prevPiecesManuelles) => [
      ...prevPiecesManuelles,
      { nomArticle: "", qteUE: "" },
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const dataToSave = [...demande, ...piecesManuelles].map((item) => {
      // Logique pour déterminer la valeur de 'art' et 'autreArt'
      let art, autreArt;
      if (item.nomArticle && item.nomArticle.article) {
        // Pièce sélectionnée à partir des options
        art = item.nomArticle.article; // Nom complet de l'article
        autreArt = null;
      } else {
        // Pièce saisie manuellement
        art = null;
        autreArt = item.nomArticle; // Seulement le nom de l'article
      }
  
      return {
        article: art,
        autreArt: autreArt,
        quantiteDemande: parseInt(item.qteUE),
        statutDemande: "En attente",
        etat: art ? "Ancien" : "Nouveau", // Déterminer l'état en fonction de la source de la pièce
        ticket: {
          interCode: ticketId,
        },
      };
    });
  
    console.log("Données de la demande:", dataToSave);
  
    try {
      const response = await demandePRService.addDemandePR(dataToSave);
      console.log("Réponse de l'enregistrement:", response.data);
      setDemande([{ nomArticle: "", qteUE: "" }]);
      setPiecesManuelles([]);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la demande:", error);
    }
  };
  

  return (
    <div
      style={{
        backgroundColor: theme.palette.mode === "light" ? "#f6f6f6" : "#0f0f0f",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="10px"
          sx={{
            fontWeight: 500,
          }}
        >
          Piece de rechange
        </Typography>
        <IconButton onClick={addDemande} sx={{ backgroundColor: "#e1ecec" }}>
          <AddIcon sx={{ fontSize: "32px" }} />
        </IconButton>
      </Box>
      <Box
        display="flex"
        p={2}
        flexDirection="column"
        justifyContent="center"
        margin="auto"
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
        <Header
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                Demande de pieces de rechange
              </Box>
            </Box>
          }
          subTitle=""
        />

        <form onSubmit={handleSubmit}>
          {demande.map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ marginBottom: "10px" }}
            >
              <Grid item xs={6}>
                <Autocomplete
                  options={pieces.filter(
                    (piece) =>
                      equipments.length > 0 &&
                      equipments.some(
                        (equipment) =>
                          equipment.eqptCode === piece.equipement.eqptCode
                      )
                  )}
                  getOptionLabel={(option) => option.article.nomArticle}
                  onChange={(event, value) => {
                    setPiece(value);
                    setSelectedPieceIndex(index);
                    setDemande((prevDemande) => {
                      const newDemande = [...prevDemande];
                      newDemande[index].nomArticle = value;
                      return newDemande;
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sélectionner Equipement" />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantité"
                  value={item.qteUE}
                  onChange={(e) => handleQteUEChange(index, e.target.value)}
                  type="number"
                  fullWidth
                  required
                  error={
                    piece && parseInt(item.qteUE) > parseInt(piece.eqprQte)
                  }
                  helperText={
                    piece && parseInt(item.qteUE) > parseInt(piece.eqprQte)
                      ? "La quantité saisie dépasse la quantité disponible."
                      : ""
                  }
                />
              </Grid>
            </Grid>
          ))}

          {piecesManuelles.map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ marginBottom: "10px" }}
            >
              <Grid item xs={6}>
                <TextField
                  label="Article"
                  value={item.nomArticle}
                  onChange={(e) =>
                    handleChangeNomArticle(index, e.target.value)
                  }
                  fullWidth
                  required
                  variant={
                    selectedPieceIndex === index ? "outlined" : "standard"
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantité"
                  value={item.qteUE}
                  onChange={(e) => handleChangeQteUE(index, e.target.value)}
                  type="number"
                  fullWidth
                  required
                  variant={
                    selectedPieceIndex === index ? "outlined" : "standard"
                  }
                />
              </Grid>
            </Grid>
          ))}
          <Button
            onClick={addPieceManuelle}
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
          >
            Nouvelle pièce de rechange
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", marginLeft: "49%" }}
          >
            Envoyer la demande
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default DemandePieceForm;
