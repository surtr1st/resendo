import { LoginOrRegistrate } from './views/LoginOrRegistrate';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainChat } from './views/MainChat';
import { GroupChat } from './views/GroupChat';
import { Navigator } from './views/Navigator';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginOrRegistrate />,
    },
    {
      path: '/chat',
      element: <Navigator />,
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
  return <RouterProvider router={router} />
}

export default App
