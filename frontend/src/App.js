import React, {useCallback, useState} from 'react';
import './css.css';
import 'bootstrap/dist/css/bootstrap.min.css'; //Importataan bootstrapin tyylit

import Navigation from './components/Navigation';
import UserContext from './contexts/UserContext';
import ErrorContext from './contexts/ErrorContext';

const App = () => {
  const [token, setToken] = useState(null);
  const [Email, setEmail] = useState('');
  const [UserType, setUserType] = useState('');
  const [Firstname, setName] = useState('');
  const [Success, setsuccess] = useState(false);
  const [appError, setError] = useState('');

  const login = useCallback((token, email, firstname, usertype) => {
    setToken(token);
    setEmail(email);
    setName(firstname);
    setUserType(usertype);
  },[]);

  const logout = useCallback(() => {
    setToken(null);
    setEmail(null);
    setName(null);
    setUserType(null);
  },[]);

  const setSuccess = useCallback((booleanValue) => {
    setsuccess(booleanValue);
  },[]);


  const setAppError = useCallback((err) => {
    console.log(err);
    setError(err);
  },[]);
  

  return (
    <div>
      <UserContext.Provider value={{isLoggedIn:!!token, token:token,
      login:login, logout:logout, setSuccess:setSuccess, Success:Success, Email:Email, 
      UserType: UserType, Firstname:Firstname}}>
        <ErrorContext.Provider value={{setAppError:setAppError, appError:appError}}>
          <Navigation />
        </ErrorContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;