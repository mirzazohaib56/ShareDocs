import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Upload from "./components/Upload";
import Premium from "./components/Premium";
import Main from "./components/Main";
import ProtectedRoute from "./components/ProtectedRoute";
import DownloadPage from "./components/DownloadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/premium"
          element={
            <ProtectedRoute>
              <Premium />
            </ProtectedRoute>
          }
        />
        <Route path="/download/:fileId" element={
          <ProtectedRoute><DownloadPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
