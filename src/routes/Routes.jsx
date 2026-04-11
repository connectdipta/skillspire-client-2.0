import { createBrowserRouter } from "react-router";

/* -------- Layouts -------- */
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout";

/* -------- Public Pages -------- */
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import AllContests from "../pages/AllContests";
import ContestDetails from "../pages/ContestDetails";
import ErrorPage from "../pages/ErrorPage";
import CreatorPage from "../pages/CreatorPage";

/* -------- Auth Pages -------- */
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

/* -------- Creator Dashboard -------- */
import AddContest from "../pages/dashboard/creator/AddContest";
import MyContests from "../pages/dashboard/creator/MyContests";
import Submissions from "../pages/dashboard/creator/Submissions";
import EditContest from "../pages/dashboard/creator/EditContest";

/* -------- User Dashboard -------- */
import ParticipatedContests from "../pages/dashboard/user/ParticipatedContests";
import WinningContests from "../pages/dashboard/user/WinningContests";
import MyProfile from "../pages/dashboard/user/MyProfile";
import ApplyCreator from "../pages/dashboard/user/ApplyCreator";

/* -------- Admin Dashboard -------- */
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageContests from "../pages/dashboard/admin/ManageContests";
import ContestRequests from "../pages/dashboard/admin/ContestRequests";
import ManageCreatorRequests from "../pages/dashboard/admin/ManageCreatorRequests";

/* -------- Route Guards -------- */
import PrivateRoute from "./PrivateRoute";
import CreatorRoute from "./CreatorRoute";
import AdminRoute from "./AdminRoute";
import Payment from "../pages/Payment";
import Leaderboard from "../pages/Leaderboard";
import DashboardHome from "../pages/dashboard/DashboardHome";
import Blog from "../pages/Blog";
import TermsAndConditions from "../pages/TermsAndConditions";

export const router = createBrowserRouter([
  /* ================= MAIN SITE ================= */
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "aboutUs", element: <AboutUs /> },
      { path: "blog", element: <Blog /> },
      { path: "terms", element: <TermsAndConditions /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "creator", element: <CreatorPage /> },
      {
        path: "all-contests",
        element: (
            <AllContests />
        ),
      },
      {
        path: "contests/:id",
        element: (
            <ContestDetails />
        ),
      },
      {
        path: "payment/:id",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
         ),
      },
    ],
  },

  /* ================= AUTH ================= */
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  /* ================= DASHBOARD ================= */
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
      index: true,
      element: <DashboardHome />,
     },
      /* -------- CREATOR -------- */
      {
        path: "add-contest",
        element: (
          <CreatorRoute>
            <AddContest />
          </CreatorRoute>
        ),
      },
      {
        path: "my-contests",
        element: (
          <CreatorRoute>
            <MyContests />
          </CreatorRoute>
        ),
      },
      {
        path: "submissions",
        element: (
          <CreatorRoute>
            <Submissions />
          </CreatorRoute>
        ),
      },
      {
        path: "edit/:id",
        element: (
          <CreatorRoute>
            <EditContest />
          </CreatorRoute>
        ),
      },

      /* -------- USER -------- */
      {
        path: "participated",
        element: <ParticipatedContests />,
      },
      {
        path: "winnings",
        element: <WinningContests />,
      },
      {
        path: "profile",
        element: <MyProfile />,
      },
      {
        path: "apply-creator",
        element: <ApplyCreator />,
      },

      /* -------- ADMIN -------- */
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-contests",
        element: (
          <AdminRoute>
            <ManageContests />
          </AdminRoute>
        ),
      },
      {
        path: "contest-requests",
        element: (
          <AdminRoute>
            <ContestRequests />
          </AdminRoute>
        ),
      },
      {
        path: "creator-requests",
        element: (
          <AdminRoute>
            <ManageCreatorRequests />
          </AdminRoute>
        ),
      },
    ],
  },
]);
