import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { store } from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router'
import {AddNotesPage, HomePage, LoginPage, SignupPage, EditNotesPage, NotesPage, RecentlyDeletedPage }from './pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children:[
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: '/user',
        children: [
          {
            path: '/user/login',
            element: <LoginPage/>
          },
          {
            path: '/user/signup',
            element: <SignupPage/>
          },
        ]
      },     
      {
        path: '/notes',
        children: [
          {
            path: '/notes/add-notes',
            element: <AddNotesPage/>
          },
          {
            path: '/notes/edit-notes/:slug',
            element: <EditNotesPage/>
          },
          {
            path: '/notes/get-notes/:slug',
            element: <NotesPage/> 
          },
          {
            path: '/notes/recently-deleted',
            element: <RecentlyDeletedPage/>
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
      <App />
      </RouterProvider>
    </Provider>
  </StrictMode>,
)
