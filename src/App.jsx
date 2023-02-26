import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Recipe from './components/Recipe'
import './index.css'

// Layouts
import Main from './components/Main'

// Routes
import Dashboard from './pages/Dashboard'
import Error from './pages/Error'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        // loader: dashboardLoader,
      },
      {
        path: '/about',
        element: <p>about</p>,
      },
    ],
  },
  {
    path: '/recipe/:recipeId',
    element: <Recipe />,
  },
  {
    path: '*',
    element: <Error />,
  },
])

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
