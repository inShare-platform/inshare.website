import Layout from "../layout";
import { routes as AnalyticsRoute } from "./analytics/analytics.route";
import { ClientViewerRoutes } from "./clientviewer/clientviewer.route";
import {routes as DashboardRoutes} from './dashboard/dashboard.route';

const routes = [
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
