import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  useTheme,
  FormControlLabel,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useForm } from "react-hook-form";
import { ticketService } from "../../services/ticke_servicet";
import "./ajout.css";
import { DateTimePicker } from "@mui/x-date-pickers";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import Header from "../../components/Header";
import { adminService } from "../../services/equipement_service";
import { useNavigate } from "react-router-dom";
import { technicienService } from "../../services/technicien_service";

const AddTicketForm = () => {
  const theme = useTheme();
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [sousGarantie, setSousGarantie] = useState("N");
  const [sousContrat, setSousContrat] = useState("N");
  const [priorite, setPriorite] = useState("");
  const [machineArret, setMachineArret] = useState("Non");
  const [dureeArret, setDureeArret] = useState(0);
  const [dateArret, setDateArret] = useState(null);
  const [equipement, setEquipement] = useState([]);
  const [nature, setNature] = useState([]);
  const [technicien, setTechnicien] = useState(null);

  const [eq, setEq] = useState([]);
  const [nat, setNat] = useState([]);
  const [techniciens, setTechniciens] = useState([]);

  let navigate = useNavigate();

  const loadNature = async () => {
    try {
      const response = await ticketService.getAllNature();
      setNat(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  const loadEquipement = async () => {
    try {
      const response = await adminService.getAllEquipements();
      setEq(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  const loadTechniciens = async () => {
    try {
      const response = await technicienService.getAllTechniciens();
      setTechniciens(response.data);
      console.log("tec", response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  useEffect(() => {
    loadNature();
    loadEquipement();
    loadTechniciens();
  }, []);

  const prio = ["Haute", "Moyenne", "Faible"];

  const handleSaveDialog = () => {
    // Vérification si les champs obligatoires sont vides
    const ticket = {
      dateArre: dateArret,
      description: description,
      dureeArret: dureeArret,
      equipement: equipement,
      dateCreation: new Date(),
      interDesignation: designation,
      interPriorite: priorite,
      interStatut: "En attente",
      interventionNature: nature,
      machineArret: machineArret,
      sousContrat: sousContrat,
      sousGarantie: sousGarantie,
      technicien: technicien ? { codeTechnicien: technicien.codeTechnicien } : null,
    };
    console.log("avant l'ajout", ticket),
      ticketService
        .addTicket(ticket)
        .then((response) => {
          navigate("/client/consulter_tickets");
          console.log("ticket added successfully:", response.data);
          reset();
        })
        .catch((error) => {
          console.error(error);
        });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const currentDate = useState(new Date());

  return (
    <>
      <Typography color="#aebfcb" fontSize="30px" margin="10px">
        Créer un Ticket
      </Typography>
      <Box
        display="flex"
        p={2}
        flexDirection="column"
        justifyContent="center"
        //alignItems="center"
        margin="auto"
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Header
          title={
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
              <ConfirmationNumberOutlined />
              Nouveau Ticket
            </Box>
          }
          subTitle=""
        />
        <form onSubmit={handleSubmit(handleSaveDialog)}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography fontWeight="bold">Désignation</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                autoFocus
                required
                size="small"
                placeholder="Désignation"
                variant="outlined"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography fontWeight="bold">Nature</Typography>
            </Grid>
            <Grid item xs={9}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={nat}
                size="small"
                getOptionLabel={(option) => option.libelle}
                sx={{ width: "100%" }}
                onChange={(event, value) => {
                  setNature(value);
                  console.log(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Sélectionner Nature"
                    required // Ajoutez la propriété required ici
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography fontWeight="bold">Equipement</Typography>
            </Grid>
            <Grid item xs={9}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                size="small"
                options={eq}
                getOptionLabel={(option) => option.eqptDesignation}
                sx={{ width: "100%" }}
                onChange={(event, value) => {
                  setEquipement(value);
                  console.log(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Sélectionner Equipement"
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography fontWeight="bold">Priorité</Typography>
            </Grid>
            <Grid item xs={9}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={prio}
                size="small"
                sx={{ width: "100%" }}
                onChange={(event, value) => {
                  setPriorite(value);
                  console.log(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Selectionner Priorité" />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography fontWeight="bold">Technicien</Typography>
            </Grid>
            <Grid item xs={9}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={techniciens}
                getOptionLabel={(option) =>
                  `${option.user.nom} ${option.user.prenom}`
                }
                size="small"
                sx={{ width: "100%" }}
                onChange={(event, value) => {
                  setTechnicien(value);
                  console.log("************", value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selectionner Technicien"
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography fontWeight="bold">Description</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                size="small"
                placeholder="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sousContrat === "O"}
                    onChange={(e) =>
                      setSousContrat(e.target.checked ? "O" : "N")
                    }
                  />
                }
                label={<Typography fontWeight="bold">Sous Contrat</Typography>}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sousGarantie === "O"}
                    onChange={(e) =>
                      setSousGarantie(e.target.checked ? "O" : "N")
                    }
                  />
                }
                label={<Typography fontWeight="bold">Sous Garantie</Typography>}
              />
            </Grid>
            <Grid item xs={12} container alignItems="center" spacing={2}>
              <Grid item xs={3} />
              <Grid item xs={9}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={machineArret === "Oui"}
                      onChange={(e) =>
                        setMachineArret(e.target.checked ? "Oui" : "Non")
                      }
                    />
                  }
                  label={
                    <Typography fontWeight="bold">Machine Arrêté</Typography>
                  }
                />
              </Grid>
              {machineArret === "Oui" && (
                <>
                  <Grid item xs={3}>
                    <Typography fontWeight="bold">Date d'arrêt</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack
                        // @ts-ignore
                        Stack
                        spacing={2}
                        size="small"
                      >
                        <DateTimePicker
                          value={dateArret}
                          label="Date d'arrêt"
                          onChange={(date) => setDateArret(date)}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography fontWeight="bold">Durée d'arrêt</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      size="small"
                      placeholder="Durée arrêt"
                      variant="outlined"
                      type="number"
                      value={dureeArret}
                      onChange={(e) =>
                        setDureeArret(parseFloat(e.target.value))
                      }
                      fullWidth
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Grid item xs={10} />
            <Grid item xs={2}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.primary.main
                      : theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.secondary.main
                        : theme.palette.secondary.main,
                  },
                }}
              >
                Ajouter
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default AddTicketForm;
