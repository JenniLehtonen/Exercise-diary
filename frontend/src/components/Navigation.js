import React, {useContext} from 'react';
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from 'react-router-bootstrap';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'; //Applikaation sivujen reititys
import Etusivu from '../components/Etusivu';
import Harrastajat from '../components/Harrastajat';
import Ammattilaiset from '../components/Ammattilaiset';
import OmatTreenit from '../components/OmatTreenit';
import Login from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // font awesome ikonit käyttöön
import { faHome } from '@fortawesome/free-solid-svg-icons';
import UserContext from '../contexts/UserContext';

const Navigation = () => {
    const userContext = useContext(UserContext);
    const element = <FontAwesomeIcon icon={faHome} size="2x" color="black" /> //Koti-ikoni navigoinnissa
    let navigationBar;

    //Määritellään if-else -lauseessa navigointipalkin sivujen näkyvyydet riippuen siitä, onko käyttäjä kirjautunut vai ei
    if (userContext.isLoggedIn===true){
      navigationBar = (
        <Nav className="justify-content-center">
                <LinkContainer to={'/'} exact>
                <Nav.Item>
                  {element} Etusivu
                </Nav.Item>
                </LinkContainer>
                <LinkContainer to={'/harrastajat'}>
                <Nav.Item>
                  Harrastajat
                </Nav.Item>
                </LinkContainer>
                <LinkContainer to={'/ammattilaiset'}>
                <Nav.Item>
                  Ammattilaiset
                </Nav.Item>
                </LinkContainer>
                <LinkContainer to={'Omattreenit'}>
                <Nav.Item>
                  Omat treenit
                </Nav.Item>
                </LinkContainer>
                <Nav.Item>
                    <Login />
                </Nav.Item>
                <Nav.Item style={{color:"black", cursor: "context-menu"}}>
                  Kirjautunut: {userContext.Firstname}
                </Nav.Item>
              </Nav>
      );
    } else{
      navigationBar = (
        <Nav className="justify-content-center">
                <LinkContainer to={'/'} exact>
                <Nav.Item>
                  {element} Etusivu
                </Nav.Item>
                </LinkContainer>
                <LinkContainer to={'/harrastajat'}>
                <Nav.Item>
                  Harrastajat
                </Nav.Item>
                </LinkContainer>
                <Nav.Item>
                    <Login />
                </Nav.Item>
              </Nav>
      );
    }
    return(
           <>
            <Router>
              {navigationBar}
              
              <Route exact path="/" ><Etusivu /></Route>
                <Route exact path="/harrastajat" ><Harrastajat /></Route>
                <Route exact path="/ammattilaiset" ><Ammattilaiset /></Route>
                <Route exact path="/omattreenit" ><OmatTreenit /></Route>
                <Redirect to="/" />
            </Router>
        </>
    )
}

export default Navigation;