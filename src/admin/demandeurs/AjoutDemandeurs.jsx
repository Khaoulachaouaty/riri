import { useEffect } from "react";
import {
  Autocomplete,
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
import { userService } from "../../services/user_service";
import { PersonAddAltOutlined } from "@mui/icons-material";
import { clientService } from "../../services/client_service";

const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const AjoutDemandeur = () => {
  let navigate = useNavigate();

  const [client, setClient] = useState ([]);
  
  const loadClient = async () => {
    try {
      const res = await clientService.getAllClients()
      setClient(res.data); // Mettre à jour l'état type avec les données récupérées de l'API
      console.log(res);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadClient();
  }, []);

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

  const [nom, setNom] = useState("khaoula");
  const [prenom, setPrenom] = useState("khaoula");
  const [email, setEmail] = useState("khaoulachaouatyy@gmail.com");
  const [c, setC] = useState("");

  const handleSaveDialog = (data) => {
    const user = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.mail,
      dateEmbauche: new Date(),
      codeClient: c,
      role: "CLIENT",
    };
    console.log(user);
    userService
      .creerUser(user)
      .then((response) => {
        console.log("User added successfully:", response.data);
        handleClick();
        navigate("/admin/demandeurs");
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box
      height={530}
      margin="auto"
      my={2}
      display="flex"
      p={2}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
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
              color: theme.palette.primary.main,
            }}
          >
            <PersonAddAltOutlined />
            Créer un nouveau membre de demandeurs
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
        onSubmit={handleSubmit(handleSaveDialog)}
      >
        <Grid container spacing={2} sx={{ maxWidth: "700px" }}>
        <Grid item xs={2}>
            <Typography>Nom</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              error={Boolean(errors.nom)}
              helperText={errors.nom ? "Ce champ est obligatoire" : null}
              {...register("nom", { required: true, minLength: 3 })}
              label="Nom"
              variant="outlined"
              fullWidth
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography>Prenom</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              error={Boolean(errors.prenom)}
              helperText={errors.prenom ? "Ce champ est obligatoire" : null}
              {...register("prenom", { required: true, minLength: 3 })}
              label="Prenom"
              fullWidth
              variant="outlined"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
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
              label="Adresse email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography>Client</Typography>
          </Grid>
          <Grid item xs={10}>
              <Autocomplete
                disablePortal
                options={client}
                getOptionLabel={(option) => option.nomSociete}
                sx={{ width: "100%" }}
                // @ts-ignore
                onChange={(event, value) => {
                  setC(value.codeClient);
                  console.log(value.codeClient);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    {...register("codeC", { required: true })}
                    error={Boolean(errors.codeC)}
                    helperText={
                      errors.codeType
                        ? "Ce champ est obligatoire"
                        : null
                    }
                  />
                )}
              />
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

export default AjoutDemandeur;
