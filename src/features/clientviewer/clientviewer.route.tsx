import { lazy } from "react"

const ClientViewerPage = lazy(()=> import('./clientviewer.page'))

export const ClientViewerRoutes = [
    {
        path: '',
        element: <ClientViewerPage />
    }
]