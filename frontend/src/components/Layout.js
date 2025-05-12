import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Composant qui englobe toutes les pages du projet
const Layout = () => {
  return (
    <div>
      {/* Appel de la navbar  */}
      <Navbar />
      {/* //Appel du contenu  */}
      <div className="mx-[50px] my-[25px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
