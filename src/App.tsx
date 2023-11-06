import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from './routes/ChatPage';
import AdminPage from './routes/AdminPage';
import ChaptersPage from './routes/ChaptersPage';
import LoginPage from './routes/LoginPage';
import GoogleCallback from './routes/GoogleCallback';
import Private from './components/Private';
import Authenticated from './components/Authenticated';
import UpdateRolesPage from './routes/UpdateRolesPage';
import SuperAdmin from './components/SuperAdmin';
import CreateRole from './components/CreateRole';
import CreateRolesPage from './routes/CreateRolePage';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/chat"
            element={
              <Authenticated>
                <ChatPage />
              </Authenticated>
            }
          />
          <Route
            path="/admin"
            element={
              <Private>
                <AdminPage />
              </Private>
            }
          />
          <Route
            path="/chapters"
            element={
              <Private>
                <ChaptersPage />
              </Private>
            }
          />
          <Route
            path="/update-roles"
            element={
              <SuperAdmin>
                <UpdateRolesPage />
              </SuperAdmin>
            }
          />
          <Route
            path="/create-roles"
            element={
              <SuperAdmin>
                <CreateRolesPage />
              </SuperAdmin>
            }
          />
          <Route path="/google-callback" element={<GoogleCallback />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
