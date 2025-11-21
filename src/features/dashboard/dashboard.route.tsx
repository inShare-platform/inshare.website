import { lazy } from "react"

const DashboardPage = lazy(()=> import('./dashboard.page'))

export const routes = [
    {
        path: '',
        element: <DashboardPage />
    }
]