import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LoginOrRegistrate } from './views/LoginOrRegistrate';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainChat } from './views/MainChat';
import { GroupChat } from './views/GroupChat';
import { QueryClientProvider, QueryClient } from 'react-query';

const query = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginOrRegistrate />,
  },
  {
    path: '/chat',
    element: <App />,
    children: [
      {
        path: ':id',
        element: <MainChat />,
      },
      {
        path: 'group/:id',
        element: <GroupChat />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={query}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
