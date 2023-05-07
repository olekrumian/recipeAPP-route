import { useEffect } from 'react'
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
  useEffect(() => {
    const hour = new Date().getHours()
    const body = document.body

    if (hour >= 7 && hour < 15) {
      body.classList.add('day-theme')
      body.classList.remove('night-theme')
    } else {
      body.classList.add('night-theme')
      body.classList.remove('day-theme')
    }
  }, [])
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
