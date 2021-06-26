import React, {useState, useContext} from 'react';
import {Button, Form, ToggleButton, Alert} from 'react-bootstrap';
import {register} from '../user/services/user-services';
import UserContext from '../contexts/UserContext';
import ErrorContext from '../contexts/ErrorContext';

const Register = () => {
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [show, setShow] = useState(true); //Virheilmoituksen näyttämiseen
  const errorContext = useContext(ErrorContext);
  const userContext = useContext(UserContext);

  const firstnameHandler = (e) => {
    e.preventDefault();
    setFirstname(e.target.value);
  };
  const lastnameHandler = (e) => {
    e.preventDefault();
    setLastname(e.target.value);
  };
  const emailHandler = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
    
  const registerNewAccount = () => {
    let userType;
    if(checked===true){ //asetetaan userType checkboxin arvon mukaan
      userType="professional";
    } else{
      userType="amateur";
    }

    let accountObject = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        userType: userType
    };

    register(accountObject, errorContext.setAppError, userContext.setSuccess); //lähetetään rekisteröitymistiedot eteenpäin
  };

  const closeErrorMessage = () => { //Kun painetaan rastia virheilmoituksessa, suljetaan virheilmoitus ja poistetaan virhe errorcontextista
    setShow(false);
    errorContext.setAppError(null);
  };
 
    return(
        <>
        {errorContext.appError && 
          <Alert variant="danger" onClose={() => closeErrorMessage()} dismissible centered>
            <Alert.Heading>Virhe</Alert.Heading>
            <p>
              {errorContext.appError}
            </p>
          </Alert>
          }
          <br />
          <Form.Group>
            <Form.Label>Etunimi:</Form.Label>
            <Form.Control required type="text" placeholder="Syötä etunimesi" onChange={(e) => firstnameHandler(e)}/>
            <Form.Label>Sukunimi:</Form.Label>
            <Form.Control required type="text" placeholder="Syötä sukunimesi" onChange={(e) => lastnameHandler(e)}/>
            <Form.Label>Sähköposti:</Form.Label>
            <Form.Control required type="email" placeholder="Syötä sähköpostiosoite" onChange={(e) => emailHandler(e)}/>
            <Form.Label>Salasana:</Form.Label>
            <Form.Control required type="password" placeholder="Syötä salasana" onChange={(e) => passwordHandler(e)}/>
            <ToggleButton id="registerCheckbox" type="checkbox" checked={checked} value="1" onChange={e => setChecked(e.currentTarget.checked)}><span>Olen ammattilainen</span></ToggleButton>
            <br />
            <Button onClick={registerNewAccount}>Luo tili</Button><br /><br />
          </Form.Group>
          </>
    )
}
export default Register;