import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, token } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(true);

  if (!token) {
    return showRegister ? (
      <Register 
        onSuccess={() => setShowRegister(false)} 
        onSwitchToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <Login 
        onSuccess={() => {}} 
        onSwitchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return <Home />;
}

export default App;