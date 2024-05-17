import { useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
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
import { departementService } from "../../services/departement_service";

const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const roleList = [
  {
    value: "MANAGER",
    label: "Manager",
  },
  {
    value: "TECHNICIEN",
    label: "Technicien",
  },
  {
    value: "MAGASINIER",
    label: "Magasinier",
  },
];

const AjoutEquipe = () => {
  let navigate = useNavigate();

  const [dep, setDep] = useState([]);

  const loadDepartement = async () => {
    try {
      const res = await departementService.getAllDepartements();
      setDep(res.data); // Mettre à jour l'état type avec les données récupérées de l'API
      console.log(res);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadDepartement();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [showResponsable, setShowResponsable] = useState(false);
  const [showDepartement, setShowDepartement] = useState(false);

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
  const [role, setRole] = useState("");
  const [sexe, setSexe] = useState("H");
  const [responsable, setResponsable] = useState("N");
  const [depart, setDepart] = useState("");

  console.log(new Date())

  const handleSaveDialog = (data) => {
    const user = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.mail,
      role: data.role,
      dateEmbauche: new Date(),
      sexe: sexe,
      responsable: responsable,
      codeDepart: depart,
    };
    console.log(user);
    userService
      .creerUser(user)
      .then((response) => {
        console.log("User added successfully:", response.data);
        handleClick();
        navigate("/admin/employees");
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChangeSexe = (event) => {
    setSexe(event.target.value);
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    // Afficher ou masquer les champs en fonction du rôle sélectionné
    setShowResponsable(selectedRole === "TECHNICIEN");
    setShowDepartement(selectedRole === "TECHNICIEN");
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
              mt:"10px",
              fontSize: "24px",
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            <PersonAddAltOutlined />
            Créer un nouveau membre d'équipe
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
          alignItems: "center",
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
            <Typography>Prénom</Typography>
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
            <Typography>Role</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              select
              label="Role"
              {...register("role")}
              placeholder="Selectionner un rôle"
              value={role}
              fullWidth
              onChange={handleRoleChange}
            >
              {roleList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {showResponsable && (
            <>
            <Grid xs={2}/>
           <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                options={dep}
                getOptionLabel={(option) => option.nomDepart}
                sx={{ width: "100%" }}
                // @ts-ignore
                onChange={(event, value) => {
                  setDepart(value.codeDepart);
                  console.log(value.codeDepart);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Département"
                    {...register("codeDep", { required: true })}
                    error={Boolean(errors.codeDep)}
                    helperText={
                      errors.codeType ? "Ce champ est obligatoire" : null
                    }
                  />
                )}
              />
            </Grid></>
          )}
          
          {showDepartement && (            
             <Grid item xs={4}>
             <FormControlLabel
               control={
                 <Checkbox
                   checked={responsable === "O"}
                   onChange={(e) =>
                     setResponsable(e.target.checked ? "O" : "N")
                   }
                 />
               }
               label="Responsable"
             />
           </Grid>
          )}
          <Grid item xs={6}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body1">Sexe:</Typography>
              </Grid>
              <Grid item>
                <Radio
                  checked={sexe === "H"}
                  onChange={handleChangeSexe}
                  value="H"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "H" }}
                />
              </Grid>
              <Grid item>
                <Typography variant="body1">H</Typography>
              </Grid>
              <Grid item>
                <Radio
                  checked={sexe === "F"}
                  onChange={handleChangeSexe}
                  value="F"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "F" }}
                />
              </Grid>
              <Grid item>
                <Typography variant="body1">F</Typography>
              </Grid>
            </Grid>
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

export default AjoutEquipe;
