import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, token, logout } = useContext(AuthContext);
  const [view, setView] = useState('landing');
  const [registerRole, setRegisterRole] = useState('customer');

  if (token && user?.role === 'rider') {
    return <Home onBackToHome={null} />;
  }

  if (token && view === 'dashboard') {
    return <Home onBackToHome={() => setView('landing')} />;
  }

  if (view === 'login') {
    return (
      <Login 
        onSuccess={() => {
          setView('dashboard');
        }} 
        onSwitchToRegister={() => {
          setView('register');
          setRegisterRole('customer');
        }} 
        onBackToHome={() => setView('landing')}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register 
        onSuccess={() => setView('login')} 
        onSwitchToLogin={() => setView('login')} 
        initialRole={registerRole}
        onBackToHome={() => setView('landing')}
      />
    );
  }

  return (
    <Landing 
      isLoggedIn={!!token}
      onGoToDashboard={() => setView('dashboard')}
      onLogout={() => {
        logout();
        setView('landing');
      }}
      onSignUpToDrive={() => {
        setView('register');
        setRegisterRole('rider');
      }} 
      onScheduleDelivery={() => {
        if (token) {
          setView('dashboard');
        } else {
          setView('login');
        }
      }} 
      onSignIn={() => {
        setView('login');
      }} 
      onSignUp={() => {
        setView('register');
        setRegisterRole('customer');
      }}
    />
  );
}

export default App;