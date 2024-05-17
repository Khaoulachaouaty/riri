import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box } from "@mui/material";
import {
  Block, // Ajout de l'icône Delete
} from "@mui/icons-material";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { demandeurService } from "../../services/demandeur_service";
import { userService } from "../../services/user_service";
import { format } from "date-fns";

const Demandeur = () => {
  const theme = useTheme();
  const [dataRows, setDataRows] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    // Effectue une requête GET vers votre API
    demandeurService
      .getAllDemandeurs()
      .then((response) => {
        // Ajouter un identifiant unique à chaque objet dans les données
        console.log("response", response.data);
        const updatedDataRows = response.data.map((item) => ({
          ...item,
          id: item.user.id, // Utiliser le nom correct de l'ID de la base de données
        }));
        // Met à jour l'état avec les données reçues
        setDataRows(updatedDataRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDeleteRow = (rowId) => {
    // Trouver l'utilisateur correspondant à l'ID
    const userToDelete = dataRows.find((user) => user.id === rowId);
    if (userToDelete) {
      // Afficher la boîte de dialogue de confirmation
      setSelectedRowId(userToDelete.id); // Utiliser l'ID de la base de données
      setOpenConfirmationDialog(true);
    } else {
      console.error("User not found with ID:", rowId);
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedRowId) {
      console.error("No user selected for deletion.");
      return;
    }

    // Supprimer l'utilisateur de la base de données
    userService
      .deleteUSer(selectedRowId)
      .then((response) => {
        console.log("User deleted from database:", response.data);

        // Enlever l'utilisateur du tableau
        const updatedRows = dataRows.filter(
          (user) => user.id !== selectedRowId
        );
        setDataRows(updatedRows);

        // Afficher un message de confirmation
        console.log("User deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting user from database:", error);
        // Afficher un message d'erreur
        console.error("Failed to delete user.");
      });

    setOpenConfirmationDialog(false);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const columns = [
    {
      field: "codeDemandeur",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nom",
      headerName: "Nom ",
      flex: 1,
      //align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.user.nom} {row.user.prenom}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      //align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.user.email}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "age",
      headerName: "Age",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.user.age}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "user.sexe",
      headerName: "Sexe",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.user.sexe}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "user.tel",
      headerName: "Téléphone",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.user.tel}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "post",
      headerName: "Post",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nomSociete", // Accédez à la propriété nomSociete du client
      headerName: "Société",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.client.nomSociete}</span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "dateEmbauche",
      headerName: "Date d'embauche",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{format(new Date(row.user.dateEmbauche), "dd, MMM, yyyy")}</span>
      ),
    },
    {
      field: "", // Nouvelle colonne pour l'icône Delete
      headerName: "Action", // Vous pouvez laisser vide si vous ne voulez pas de texte dans l'en-tête
      //flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Block
          color="error"
          onClick={() => handleDeleteRow(row.user.id)} // Passer l'ID de l'utilisateur à la fonction handleDeleteRow
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <Box sx={{
      maxWidth: "100%", // Ajuste la largeur au maximum de son conteneur parent
      margin: "auto",

    }}>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2, }}
      >
        <Button
          component={Link}
          to="/admin/ajout_demandeur"
          variant="outlined"
          sx={{
            color:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.main,

            borderColor:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.main,

            "&:hover": {
              color:
                theme.palette.mode === "light"
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.main,
              borderColor:
                theme.palette.mode === "light"
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.main,
            },
            marginLeft: "auto", // Alignement à droite
          }}
        >
          Ajouter
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
              <PeopleOutlinedIcon />
              Gestion de demandeurs
            </Box>
          }
          subTitle=""
        />
        <Box sx={{ minHeight: 400, mx: "auto" }}>
          <DataGrid
            rows={dataRows}
            // @ts-ignore
            columns={columns}
            //autoHeight
          />
        </Box>
      </Box>
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet élément ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Demandeur;
