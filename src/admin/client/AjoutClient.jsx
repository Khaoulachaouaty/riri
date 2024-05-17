import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { GroupAddOutlined } from "@mui/icons-material";
import { clientService } from "../../services/client_service";

const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AjoutClient = () => {
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [codePostal, setCodePostal] = useState(null);
  const [ville, setVille] = useState("");

  const handleSaveDialog = (data) => {
    const client = {
      nomSociete: data.nomSociete,
      adresse: data.adresse,
      codePostal: codePostal,
      emailSociete: data.mail,
      dateEntree: new Date(),
      tel: tel,
      ville: ville,
    };
    console.log(client);
    clientService
      .creerClient(client)
      .then((response) => {
        // Ajouter user nouvellement ajouté à la liste existante
        //setUser((prevUsers) => [...prevUsers, response.data]);
        console.log("Client added successfully:", response.data);
        handleClick();
        navigate("/admin/client");
        // Réinitialiser les champs
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box
      height={560}
      display="flex"
      p={2}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
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
              fontSize: "24px",
              fontWeight: "bold",
              color: theme.palette.primary.main, // Utilisation de la couleur principale du thème
            }}
          >
            <GroupAddOutlined />
            Créer un nouveau client
          </Box>
        }
        subTitle=""
      />
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleSaveDialog)} // Utilisation de handleSubmit avec handleSaveDialog
      >
        <Grid container spacing={2} sx={{ maxWidth: "700px" }}>
          <Grid item xs={2}>
            <Typography>Nom</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              error={Boolean(errors.nom)}
              helperText={errors.nomSociete ? "Ce champ est obligatoire" : null}
              {...register("nomSociete", { required: true })}
              label="Nom"
              variant="outlined"
              fullWidth
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography>E-mail</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              error={Boolean(errors.mail)}
              helperText={
                errors.mail ? "Veuillez fournir une adresse email valide" : null
              }
              {...register("mail", { required: true, pattern: regEmail })}
              id="outlined-basic"
              label="Adress mail"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography>Adresse</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              error={Boolean(errors.adresse)}
              helperText={errors.a ? "Ce champ est obligatoire" : null}
              {...register("adresse", { required: true})}
              label="Adresse"
              fullWidth
              variant="outlined"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography>Ville</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              label="Ville"
              value={ville}
              fullWidth
              onChange={(e) => setVille(e.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={2}>
            <Typography>Code Postal</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              label="Code Postal"
              type="number"
              value={codePostal}
              fullWidth
              onChange={(e) => setCodePostal(parseFloat(e.target.value))}
            ></TextField>
          </Grid>
          <Grid item xs={2}>
            <Typography>Téléphone</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              label="Téléphone"
              value={tel}
              fullWidth
              onChange={(e) => setTel(e.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={9} />
          <Grid item xs={3}>
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
              Créer
            </Button>
          </Grid>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Compte créé avec succès
            </Alert>
          </Snackbar>
        </Grid>
      </Box>
    </Box>
  );
};

export default AjoutClient;
