import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { CarDetail } from "./pages/carDetail";

import { Layout } from "./components/layout";
import { NotFound } from "./pages/notFound";

const router = createBrowserRouter([
   {
      element: <Layout />,
      children: [
         {
            path: "/",
            element: <Home />,
         },

         {
            path: "/car/:id",
            element: <CarDetail />,
         },
         {
            path: "/dashboard",
            element: <Dashboard />,
         },
         {
            path: "/dashboard/new",
            element: <New />,
         },
         {
            path: "*",
            element: <NotFound />,
         },
      ],
   },

   {
      path: "/login",
      element: <Login />,
   },
   {
      path: "/register",
      element: <Register />,
   },
]);

export { router };
