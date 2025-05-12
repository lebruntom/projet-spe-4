import Layout from "./components/Layout";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./store/AuthContext";
import { useContext } from "react";
import Blog from "./pages/Blog";
import BlogPrivate from "./pages/BlogPrivate";

const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext);

  //Si on a pas de currentUser (si le user n'est pas connecté)
  // retour a la page de connexion
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  //Sinon on affiche la page souhaitée
  return <Outlet />;
};

const NoAuthRoute = () => {
  const { currentUser } = useContext(AuthContext);

  //Si on a pas de currentUser (si le user n'est pas connecté)
  // retour a la page de connexion
  if (currentUser) {
    return <Navigate to="/account" replace />;
  }

  //Sinon on affiche la page souhaitée
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* Integration d'un layout qui englobe les routes  */}
      <Route path="/" element={<Layout />}>
        {/* Création des routes accessible que quand on est pas connecté */}
        <Route element={<NoAuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Création des routes protégées (accessible que quand on est connecté) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/blogPrivate" element={<BlogPrivate />} />
        </Route>

        {/* routes acessible sans autorisation */}
        <Route index element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
