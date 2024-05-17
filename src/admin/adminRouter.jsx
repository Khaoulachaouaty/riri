import { Routes, Route } from "react-router-dom";
import Equipe from "./equipe/Equipe";
import AjoutEquipe from "./ajout_equipe/AjoutEquipe";
import Dashboard from "./dashboard/Dashboard";
import MiniDrawer from "./admin";
import NotFound from "../components/NotFound";
import ProfilePage from "../profile";
import Client from "./client/ConsulterClient";
import AjoutClient from "./client/AjoutClient";
import AjoutDemandeurs from "./demandeurs/AjoutDemandeurs";
import Demandeur from "./demandeurs/Demandeur";

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<MiniDrawer />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Equipe />} />
        <Route path="ajout_employees" element={<AjoutEquipe />} />
        <Route path="demandeurs" element={<Demandeur />} />
        <Route path="ajout_demandeur" element={<AjoutDemandeurs />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="client" element={<Client />} />
        <Route path="ajout_client" element={<AjoutClient />} />
      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AdminRouter;
