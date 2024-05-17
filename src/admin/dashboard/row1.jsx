import { Stack, useTheme } from "@mui/material";
import Card from "./card";
import { useEffect, useState } from "react";
import { NombreTickets } from "../../services/nombreTicket_service";
import { Business, Badge } from "@mui/icons-material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

const Row1 = () => {
  const theme = useTheme();

  const [total, setTotal] = useState(0);
  const [technicien, setTechnicien] = useState(0);
  const [client, setClient] = useState(0);
  const [demandeur, setDemandeur] = useState(0);

  const loadTicketToltal = async () => {
    try {
      const response = await NombreTickets.getTotalTicket();
      setTotal(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadTechnicien = async () => {
    try {
      const response = await NombreTickets.getEnAttenteTicket();
      setTechnicien(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadClient = async () => {
    try {
      const response = await NombreTickets.getTicketAReliser();
      setClient(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };
  const loadDemandeur = async () => {
    try {
      const response = await NombreTickets.getTicketBloque();
      setDemandeur(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };


  useEffect(() => {
    loadTicketToltal();
    loadTechnicien();
    loadClient();
    loadDemandeur();
  }, []);

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={1}
      justifyContent={{ xs: "center", sm: "space-between" }}
    >
      <Card
        title={"Techniciens"}
        nombre={technicien}
        icon={<Badge sx={{ fontSize: "40px", color: theme.palette.secondary.main }} />}
      />

      <Card
        title={"Clients"}
        nombre={client}
        icon={<Business  sx={{ fontSize: "40px", color: theme.palette.secondary.main }} />}
      />

      <Card
        title={"Demandeurs"}
        nombre={demandeur}
        icon={<PeopleOutlinedIcon  sx={{ fontSize: "40px", color: theme.palette.secondary.main }} />}
      />
    </Stack>
  );
};

export default Row1;
