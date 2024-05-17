import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Button,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { demandePRService } from "./../services/demandePR_service";
import { styled } from "@mui/material/styles";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const Accueil = () => {
  const theme = useTheme();
  const [demandes, setDemandes] = useState({});
  const [filtre, setFiltre] = useState("Tous");

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.mode === "light" ? "#000" : "#fff",
  }));

  const loadAndGroupDemandes = async () => {
    try {
      const response = await demandePRService.getAllDemandePR();
      const filteredDemandes = response.data.filter((demande) => {
        // Filtrer selon le filtre sélectionné et le statut "Accepter"
        if (filtre === "Tous") return demande.statutDemande === "Accepter";
        return (
          demande.distingtion === filtre && demande.statutDemande === "Accepter"
        );
      });
      const groupedDemandes = groupDemandesByInterCode(filteredDemandes);
      setDemandes(groupedDemandes);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    loadAndGroupDemandes();
  }, [filtre]);

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

  const updateChampDone = async (interCode) => {
    try {
      await demandePRService.updateChampDone(interCode);
      console.log("Champ Done mis à jour pour interCode:", interCode);
    } catch (error) {
      console.error("Error updating Done field:", error);
    }
  };

  const updateChampNonDone = async (interCode) => {
    try {
      await demandePRService.updateChapNonDone(interCode);
      console.log("Champ Non-Done mis à jour pour interCode:", interCode);
    } catch (error) {
      console.error("Error updating Non-Done field:", error);
    }
  };

  return (
    <Box component="main">
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
          Liste des demandes
        </Typography>
        <Select
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          variant="outlined"
          style={{ marginBottom: 20 }}
        >
          <MenuItem value="Tous">Tous</MenuItem>
          <MenuItem value="consommé">Consommé</MenuItem>
          <MenuItem value="non consommé">Non Consommé</MenuItem>
          <MenuItem value="new">Nouveau</MenuItem>
        </Select>
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
          return (
            <TableContainer
              key={interCode}
              component={Paper}
              sx={{
                backgroundColor: demandeGroup.some(
                  (d) => d.distingtion === "non consommé"
                )
                  ? (theme) =>
                      theme.palette.mode === "light" ? "#fef2f3" : "#190004"
                  : demandeGroup.some((d) => d.distingtion === "new")
                  ? (theme) =>
                      theme.palette.mode === "light" ? "#fff" : "#262626"
                  : (theme) =>
                      theme.palette.mode === "light" ? "#f1ffc7" : "#0e1801",
                padding: "20px",
                borderRadius: "15px",
                width: 430,
              }}
            >
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Article</StyledTableCell>
                    <StyledTableCell>Quantité</StyledTableCell>
                    <StyledTableCell>Etat</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandeGroup.map((articleDemande, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>
                        {articleDemande.etat === "Ancien"
                          ? articleDemande.article.nomArticle
                          : articleDemande.autreArt}
                      </StyledTableCell>
                      <StyledTableCell>
                        {articleDemande.quantiteDemande}
                      </StyledTableCell>
                      <StyledTableCell>
                        <span
                          style={{
                            fontWeight:
                              articleDemande.etat === "Nouveau"
                                ? "bold"
                                : "normal",
                            color:
                              articleDemande.etat === "Nouveau"
                                ? theme.palette.mode === "light"
                                  ? "#e02222"
                                  : "#ff6161"
                                : theme.palette.mode === "light"
                                ? "#000"
                                : "#fff",
                          }}
                        >
                          {articleDemande.etat === "Ancien"
                            ? "Modifié"
                            : "Nouveau"}
                        </span>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                {/* Affiche le bouton "Traiter" pour les distinctions "new" ou "non consommé" */}
                {["new", "non consommé"].includes(
                  demandeGroup[0].distingtion
                ) && (
                  <Button variant="contained" color="primary" >
                    Traiter
                  </Button>
                )}
                {/* Affiche les boutons d'icône uniquement si la distinction est "consommé" */}
                {demandeGroup.every((d) => d.distingtion === "consommé") && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      ml:40,
                    }}
                  >
                    <IconButton onClick={() => updateChampDone(interCode)}>
                      <DoneIcon
                        sx={{
                          color:
                            theme.palette.mode === "light"
                              ? "#007400"
                              : "#9dff89",
                        }}
                      />
                    </IconButton>
                    <IconButton onClick={() => updateChampNonDone(interCode)}>
                      <CloseIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </TableContainer>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      ></Box>
    </Box>
  );
};

export default Accueil;
