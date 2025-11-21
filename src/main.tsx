import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from 'react-router-dom'
import routes from './features/routes.tsx'
const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
    <App router={router}/>
)
