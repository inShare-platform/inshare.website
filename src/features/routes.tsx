import { Navigate } from 'react-router-dom';
import LoginPage from './auth/pages/Login.page';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import Layout from '../layout';
import DashboardPage from './dashboard/pages/Dashboard.page';
import OrganizationsListPage from './organizations/pages/OrganizationsList.page';
import OnboardOrganizationPage from './organizations/pages/OnboardOrganization.page';
import OrganizationDetailsPage from './organizations/pages/OrganizationDetails.page';

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/organizations',
            children: [
              {
                index: true,
                element: <OrganizationsListPage />,
              },
              {
                path: 'onboard',
                element: <OnboardOrganizationPage />,
              },
              {
                path: ':id',
                element: <OrganizationDetailsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
