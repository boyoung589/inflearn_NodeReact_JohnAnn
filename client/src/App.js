import React from "react";
import {
  BrowserRouter as Router,
  Route,
  // Link,
  Routes
} from "react-router-dom";
//react-router-dom version 6부턴 Switch를 지원하지 않음.

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact={true} path={'/'} element={<LandingPage />}/>
          <Route exact={true} path={'/login'} element={<LoginPage />}/>
          <Route exact={true} path={'/register'} element={<RegisterPage />}/>
        </Routes>
      </div>
    </Router>
  );
}


export default App;