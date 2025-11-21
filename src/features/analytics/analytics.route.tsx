import { lazy } from "react"


const AnalyticsPage = lazy(()=> import("./analytics.page"))

export const routes = [
    {
        path: '',
        element: <AnalyticsPage />
    }
]
