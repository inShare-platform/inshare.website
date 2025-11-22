import { Navigate } from "react-router-dom";
import Layout from "./layout";
import { routes as AnalyticsRoute } from "./features/analytics/analytics.route";
import { ClientViewerRoutes } from "./features/clientviewer/clientviewer.route";
import {routes as DashboardRoutes} from './features/dashboard/dashboard.route';

const routes = [
  {
    path: '/',
    element: <Navigate to="/features/dashboard" replace />
  },
  {
    path: 'features',
    element: <Layout />,
    children: [
      {
        path: 'analytics',
        children: AnalyticsRoute
      },
      {
        path: 'dashboard',
        children: DashboardRoutes
      },
      {
        path: 'clientviewer',
        children: ClientViewerRoutes
      }
    ]
  }
];


export default routes
