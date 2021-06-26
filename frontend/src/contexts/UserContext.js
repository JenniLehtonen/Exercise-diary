import React from 'react';

const UserContext = React.createContext({
    token:null,
    isLoggedIn: false,
    Email: null,
    Firstname: null,
    UserType: null,
    Success: null, //Onnistumisviesteihin, käytetään esim. kun rekisteröityminen onnistuu
    setSuccess: () => {},
    login: () => {},
    logout: () => {}
});

export default UserContext