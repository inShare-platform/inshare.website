import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store/store';

const App = ({ router }: any) => {

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
