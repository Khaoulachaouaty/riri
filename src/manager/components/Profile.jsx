import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  Box,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  List,
  ListItemButton,
  ListItemText,
  Grid,
  Autocomplete,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Profile = () => {
  const initialUserData = {
    nom: "Doe",
    prenom: "John",
    age: 30,
    telephone: "0123456789",
    email: "john.doe@example.com",
    username: "johndoe",
    password: "123",
    photo: "https://via.placeholder.com/150",
  };

  const theme = useTheme();

  const [userData, setUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  const [tempUserData, setTempUserData] = useState({});
  const [tempPhoto, setTempPhoto] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sexe, setSexe] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(2); // Sélection par défaut sur "Mon profile"
  const sexeOptions = ["Homme", "Femme"];


  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    // Réinitialiser les données temporaires lors du changement de sélection
    setTempUserData({});
    setTempPhoto(null);
    setEditMode(index === 2 ? true : false);
  };

  const handleEdit = () => {
    setTempUserData(userData);
    setEditMode(true);
    setSelectedIndex(2); // Afficher les champs de profil
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempPhoto(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...tempUserData, photo: tempPhoto || userData.photo });
    setTempUserData({});
    setTempPhoto(null);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempUserData({});
    setTempPhoto(null);
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    // Vérifier si le mot de passe actuel est correct
    if (currentPassword !== userData.password) {
      console.log("Mot de passe actuel incorrect");
      return;
    }

    // Vérifier si les nouveaux mots de passe sont identiques
    if (newPassword !== confirmPassword) {
      console.log("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    // Si tout est correct, effectuer la modification du mot de passe
    console.log("Mot de passe changé avec succès");
    // Mettre à jour le mot de passe dans les données utilisateur
    setUserData({ ...userData, password: newPassword });
    // Réinitialiser les champs de mot de passe
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const toggleShowPasswordCurrent = () => {
    setShowPasswordCurrent(!showPasswordCurrent);
  };

  const toggleShowPasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const toggleShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
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
        Mon Compte
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.main
                : theme.palette.background.main,
            padding: "20px",
            borderRadius: "15px",
            mr: "20px",
            width: "30%",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="20px"
            marginTop={2}
          >
            <Box position="relative">
              <Avatar
                alt="User Photo"
                src={editMode ? tempPhoto || userData.photo : userData.photo}
                sx={{ width: 150, height: 150 }}
              />
              {editMode && (
                <label
                  htmlFor="photo-input"
                  style={{ position: "absolute", bottom: 10, right: 0 }}
                >
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    size="small"
                    sx={{
                      color: theme.palette.mode === "dark" ? "#fff" : "#758dff",
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#f1f5ff" : "#cedaff",
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 30 }} />
                  </IconButton>
                </label>
              )}
            </Box>
            <input
              type="file"
              accept="image/*"
              id="photo-input"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              {userData.prenom} {userData.nom}
            </Typography>
            <Typography color="#7a7b7f">{userData.email}</Typography>
          </Box>
          <List component="nav" aria-label="secondary mailbox folder" sx={{mt:5}}>
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemText primary="Mon profile" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemText primary="Changer mot de passe" />
            </ListItemButton>
          </List>
        </Box>
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.main
                : theme.palette.background.main,
            padding: "20px",
            borderRadius: "15px",
            width: "70%",
            
          }}
        >
          {selectedIndex === 2 && ( // Afficher les champs de profil si Mon profile est sélectionné
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "800px",
                gap: "10px",
                marginTop: 30,
                marginLeft:30,
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 2, color: theme.palette.mode === "light" ? "#07185f" : "#b0d8ff"}} >
                Mon profile
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography fontSize={18}>Nom</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name="nom"
                    size="small"
                    fullWidth
                    value={
                      editMode ? tempUserData.nom || userData.nom : userData.nom
                    }
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography fontSize={18}>Prénom</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name="prenom"
                    size="small"
                    fullWidth
                    value={
                      editMode
                        ? tempUserData.prenom || userData.prenom
                        : userData.prenom
                    }
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography fontSize={18}>Age</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name="age"
                    size="small"
                    type="number"
                    fullWidth
                    value={
                      editMode ? tempUserData.age || userData.age : userData.age
                    }
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography fontSize={18}>Téléphone</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name="telephone"
                    size="small"
                    fullWidth
                    value={
                      editMode
                        ? tempUserData.telephone || userData.telephone
                        : userData.telephone
                    }
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography fontSize={18}>E-mail</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name="email"
                    size="small"
                    type="email"
                    fullWidth
                    value={
                      editMode
                        ? tempUserData.email || userData.email
                        : userData.email
                    }
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography fontSize={18}>Sexe</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Autocomplete
                    options={sexeOptions}
                    value={
                      editMode ? tempUserData.sexe || userData.sexe : userData.sexe
                    }
                    onChange={(event, newValue) => {
                      setTempUserData((prevData) => ({
                        ...prevData,
                        sexe: newValue,
                      }));
                    }}
                    renderInput={(params) => <TextField {...params} size="small" />}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography fontSize={18}>Nom utilisateur</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name="username"
                    size="small"
                    fullWidth
                    value={
                      editMode
                        ? tempUserData.username || userData.username
                        : userData.username
                    }
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>

  
              {editMode && (
             <Grid container spacing={2} alignItems="center" justifyContent="flex-end" >
             <Grid item xs={4}>
  <Button
    type="submit"
    variant="contained"
    sx={{
      backgroundColor: theme.palette.mode === "light" ? "#6580cc" : "#867ffa",
      color: "#fff" ,
      "&:hover": {
        backgroundColor: theme.palette.mode === "light" ? "#5736cc" : "#644fff",
      },
      marginRight: 2,
      flex: 1,
    }}
  >
    Enregistrer
  </Button>
  <Button
    onClick={handleCancel}
    variant="contained"
    color="secondary"
    sx={{
      color: "#fff",
    }}
  >
    Annuler
  </Button>
</Grid>

           </Grid>
           
              )}
            </form>
          )}
          {selectedIndex === 3 && ( // Afficher les champs de changement de mot de passe si Changer mot de passe est sélectionné
            <Grid sx={{marginTop:3}}>
              <AccordionSummary >
                <Typography variant="h5" sx={{color: theme.palette.mode === "light" ? "#07185f" : "#b0d8ff"}}>Changer le mot de passe</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="10px"
                  width="100%"
                  sx={{mt:4}}
                >
                  <TextField
                    label="Mot de passe actuel"
                    type={showPasswordCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowPasswordCurrent}>
                            {showPasswordCurrent ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Nouveau mot de passe"
                    type={showPasswordNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowPasswordNew}>
                            {showPasswordNew ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirmer le nouveau mot de passe"
                    type={showPasswordConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowPasswordConfirm}>
                            {showPasswordConfirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordChange}
                  >
                    Modifier le mot de passe
                  </Button>
                </Box>
              </AccordionDetails>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
