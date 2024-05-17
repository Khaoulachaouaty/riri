import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import {
  SecurityOutlined,
  ManageAccountsOutlined,
  Badge,
  Block,
  GroupsOutlined, // Ajout de l'icône Delete
} from "@mui/icons-material";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { userService } from "../../services/user_service";
import { Link } from "react-router-dom";
import { managerService } from "../../services/manager_service";
import { technicienService } from "../../services/technicien_service";
import { format } from "date-fns";
import { magasinierService } from "../../services/magasinier_service";

const Equipe = () => {
  const theme = useTheme();
  const [dataRows, setDataRows] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    // Effectue une requête GET vers votre API pour récupérer les managers
    managerService
      .getAllManagers()
      .then((managersResponse) => {
        console.log(managersResponse.data);
        // Effectue une requête GET pour récupérer les techniciens
        technicienService
          .getAllTechniciens()
          .then((techniciensResponse) => {
            console.log(techniciensResponse.data);
            // Effectue une requête GET pour récupérer les magasiniers
            magasinierService
              .getAllMagasiniers()
              .then((magasiniersResponse) => {
                console.log(magasiniersResponse.data);
                // Concatène les données des managers, des techniciens et des magasiniers
                const updatedDataRows = [
                  ...managersResponse.data.map((item) => ({
                    ...item,
                    id: item.user.id,
                  })),
                  ...techniciensResponse.data.map((item) => ({
                    ...item,
                    id: item.user.id,
                  })),
                  ...magasiniersResponse.data.map((item) => ({
                    ...item,
                    id: item.user.id,
                  })),
                ];

                // Met à jour l'état avec les données combinées
                setDataRows(updatedDataRows);
              })
              .catch((magasiniersError) => {
                console.error("Error fetching magasiniers data:", magasiniersError);
              });
          })
          .catch((techniciensError) => {
            console.error("Error fetching techniciens data:", techniciensError);
          });
      })
      .catch((managersError) => {
        console.error("Error fetching managers data:", managersError);
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
      field: "id",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nom",
      headerName: "Nom ",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>
          {row.user.nom} {row.user.prenom}
        </span> // Concaténez nom et prénom ici
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
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
      field: "responsable",
      headerName: "Responsable",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>
          {row.responsable === "N"
            ? "Non"
            : row.responsable === "O"
            ? "Oui"
            : "-"}
        </span>
      ),
    },
    {
      field: "nomDepart",
      headerName: "Departement",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <span>{row.departement ? row.departement.nomDepart : "-"}</span>
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
      field: "role",
      headerName: "Rôle",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        // Déstructurez correctement l'objet row
        const { role } = row.user; // Accédez à la propriété role de manière appropriée
        return (
          <Box
            sx={{
              p: "5px",
              width: "110px",
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",

              backgroundColor:
                role === "MANAGER"
                  ? theme.palette.secondary.dark
                  : role === "TECHNICIEN"
                  ? theme.palette.mode === "light"
                    ? "#3b757f"
                    : "#5faab1"
                  :role === "MAGASINIER"
                  ? theme.palette.mode === "light" ? "#336850" : "#67a083"
                  : "#95c0a9",
            }}
          >
            {role === "MANAGER" && (
              <SecurityOutlined sx={{ color: "#fff" }} fontSize="small" />
            )}

            {role === "TECHNICIEN" && (
              <ManageAccountsOutlined sx={{ color: "#fff" }} fontSize="small" />
            )}

            {role === "MAGASINIER" && (
              <Badge sx={{ color: "#fff" }} fontSize="small" />
            )}
            <Typography sx={{ fontSize: "13px", color: "#fff" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Delete", // Nouvelle colonne pour l'icône Delete
      headerName: "Action", // Vous pouvez laisser vide si vous ne voulez pas de texte dans l'en-tête
      //flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Block
          color="error"
          onClick={() => handleDeleteRow(row.id)} // Passer l'ID de l'utilisateur à la fonction handleDeleteRow
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 64px)", // Hauteur minimale de la vue moins la hauteur de la barre d'app bar
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
      >
        <Button
          component={Link}
          to="/admin/ajout_employees"
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
              <GroupsOutlined />
              Gestion des Employées
            </Box>
          }
          subTitle=""
        />
        <Box sx={{ minHeight: 400, mx: "auto" }}>
          <DataGrid
            rows={dataRows}
            // @ts-ignore
            columns={columns}
            getRowId={(row) => row.id} // Fournir une fonction getRowId pour obtenir une clé unique pour chaque ligne
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

export default Equipe;
