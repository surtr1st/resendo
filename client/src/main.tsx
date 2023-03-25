import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LoginOrRegistrate } from './views/LoginOrRegistrate';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainChat } from './views/MainChat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginOrRegistrate />
  },
  {
    path: '/chat',
    element: <App />,
    children: [
      {
        path: ':id',
        element: <MainChat />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
