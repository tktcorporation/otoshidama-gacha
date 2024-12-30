import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { GachaPage } from '@/pages/GachaPage';
import { ResultPage } from '@/pages/ResultPage';
import { Toaster } from '@/components/ui/toaster';

const router = createBrowserRouter([
  {
    path: '/',
    element: <GachaPage />,
  },
  {
    path: '/result/:amount',
    element: <ResultPage />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;