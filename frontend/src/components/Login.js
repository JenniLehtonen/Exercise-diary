import React, {useContext, useState} from 'react';
import {Button, Form, Alert, Modal} from 'react-bootstrap';
import UserContext from '../contexts/UserContext';
import ErrorContext from '../contexts/ErrorContext';
import {login, logout} from '../user/services/user-services';
import Register from './Register';
import {BrowserRouter as Redirect, useHistory} from 'react-router-dom'; //Applikaation sivujen reititys

const Login = () => {
  const userContext = useContext(UserContext);
  const errorContext = useContext(ErrorContext);
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(true); //Virheilmoituksen näyttämiseen
  let history = useHistory();
  let registerationSuccess = ""; //Alustetaan muuttuja, jotta ilmoitus rekisteröitymisen onnistumisesta pystytään näyttämään
  
  const logOut = () => {
    logout(userContext.logout, userContext.setEmail, userContext.setUsertype, userContext.setFirstname) //Kirjaudutaan ulos userContextissa olevan metodin avulla
    console.log(userContext);
    history.push('/') //Palataan etusivulle
  }
  //Määritetään loginButtonin ulkoasu ja toiminnot sen perusteella, onko käyttäjä kirjautunut vai ei
  let loginButton;
  if(userContext.isLoggedIn===true){
    loginButton = (<Button variant="danger"  onClick={logOut}>Kirjaudu ulos</Button>);
  } else {
    loginButton = (<Button variant="primary" onClick={() => setModalShow(true)}>Kirjaudu</Button>);
  }
  
    function MyVerticallyCenteredModal(props) {
    
      const [user, setUser] = useState({
        password: "",
        name: "",
        email: ""
      });
      const [visible, setVisible] = useState(false); //Rekisteröitymis-painiketta varten

      const emptyErrorContext = (e) => {
        errorContext.setAppError(null);
        setVisible(!visible);
      }
      
      const button = (
        <Button id="register" onClick={emptyErrorContext}>Rekisteröidy</Button> //Rekisteröitymispainikkeen näkyvyyden muuttaminen
      );

      const emailHandler = (e) => {
        e.preventDefault();
        setUser({...user, email:e.target.value});
      };

      const passwordHandler = (e) => {
        e.preventDefault();
        setUser({...user, password:e.target.value});
      };

      const handleSubmit = (e) => {
          if(login(user, errorContext.setAppError, userContext.login, userContext.setUsertype, userContext.setFirstname)==="virhe"){
            setModalShow(true);
          } else {
            userContext.setSuccess(false); //Asetetaan success-tila falseksi (Jos käyttäjä on ensin rekisteröitynyt, ei sitten kirjautumisen jälkeen näytetä onnistumis-viestejä)
            closeErrorMessage();
          }
      }

      const closeErrorMessage = () => { //Kun painetaan rastia virheilmoituksessa, suljetaan virheilmoitus ja poistetaan virhe errorcontextista
        setShow(false);
        errorContext.setAppError(null);
      };
      
      if(userContext.Success===true){
        registerationSuccess = (
          <Alert variant="success">
            Rekisteröityminen onnistui!
        </Alert>
        );
      }
        return(
         <>
          {UserContext.isLoggedIn ? <Redirect to='/'/>:
          
          <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Kirjaudu sisään
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group>
            <h6>Kirjoita sähköposti ja salasana</h6>
            <Form.Label>Sähköposti:</Form.Label>
            <Form.Control type="email" placeholder="Syötä sähköposti" 
            required value={user.email}
            onChange={(e) => emailHandler(e)}/>
            <Form.Label>Salasana:</Form.Label>
            <Form.Control type="password" placeholder="Syötä salasana"
            required value={user.password}
            onChange={(e) => passwordHandler(e)} />
            <br />
            <Button id="logIn" onClick={() =>{handleSubmit();}}>Kirjaudu sisään</Button>
          </Form.Group>
          {errorContext.appError && 
          <Alert variant="danger" onClose={() => closeErrorMessage()} dismissible>
            <Alert.Heading>Virhe</Alert.Heading>
            <p>
              {errorContext.appError}
            </p>
          </Alert>
          }
          {registerationSuccess}
        </Form>
          <br />
          <h6>Eikö sinulla ole vielä tiliä?</h6>
          {button}
          {visible && <Register />}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModalWindow}>Sulje</Button>
        </Modal.Footer>
      </Modal>
    }
      </>
        );
        
    }
    const closeModalWindow = () => { //Kutsutaan, kun halutaan sulkea kirjautumiseen/rekisteröitymiseen tarkoitettu modaali-ikkuna
      errorContext.setAppError(null); //Tyhjennetään mahdolliset kirjautumisessa tai rekisteröitymisessä tulleet virheet errorContextista
      userContext.setSuccess(false); //Vaihdetaan Success-arvo falseksi, kun suljetaan modaali-ikkuna. Näin onnistuminen rekisteröitymisestä ei näy enää, jos ikkuna avataan uudestaan
      setModalShow(false); //Suljetaan modaalinen ikkuna
    };

    return(
        <>
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={closeModalWindow}
          />
          {loginButton}
        </>
    )
}
export default Login;