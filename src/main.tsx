import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/index';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root') as HTMLDivElement;

const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId="1073311731936-0k0glnamdhv6bdkf8pupd4k6rldnemg2.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);
