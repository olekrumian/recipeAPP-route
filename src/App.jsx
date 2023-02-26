import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Recipe from './components/Recipe'
import './index.css'

// Layouts
import Main from './layouts/Main'

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

// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Main from './layouts/Main'
// import Dashboard from './pages/Dashboard'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Main />}>
//           <Route path="/" element={<Dashboard />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App
