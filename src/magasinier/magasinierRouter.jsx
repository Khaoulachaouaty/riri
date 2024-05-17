import { Routes, Route } from "react-router-dom";
import NotFound from "../components/NotFound";
import MiniDrawer from "./magasinier";
import Accueil from "./Accueil";
import Profile from "./components/Profile";
import Article from "./Article";

const MagasinierRouter = () => {
  return (
    <Routes>
      <Route element={<MiniDrawer />}>
        <Route path="accueil" element={<Accueil />} />
        <Route index element={<Accueil />} />
        <Route path="profile" element={<Profile />} />
        <Route path="article" element={<Article />} /> 
      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default MagasinierRouter;
