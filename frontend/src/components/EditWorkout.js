import React, {useState, useContext} from 'react';
import {Button, Form, Alert} from 'react-bootstrap';
import {editWorkout} from '../user/services/user-services';
import UserContext from '../contexts/UserContext';
import ErrorContext from '../contexts/ErrorContext';

const EditWorkout = (props) => {
  const userContext = useContext(UserContext);
  const errorContext = useContext(ErrorContext);
  const [date, setDate] = React.useState('');
  const [sport, setSport] = React.useState('');
  const [times, setTimes] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [show, setShow] = useState(true); //Virheilmoituksen näyttämiseen

  const person = userContext.Email; //Haetaan userContextista kirjautuneen käyttäjän sähköpostiosoite ja käyttäjätyyppi treenien muokkausta varten
  const usertype = userContext.UserType;
  const token = userContext.token;


  let editSuccess = ""; //Alustetaan muuttuja, jotta ilmoitus treenin editoinnin onnistumisesta pystytään näyttämään

  const dateHandler = (e) => {
    e.preventDefault();
    setDate(e.target.value);
  };
  const sportHandler = (e) => {
    e.preventDefault();
    setSport(e.target.value);
  };
  const timesHandler = (e) => {
    e.preventDefault();
    setTimes(e.target.value);
  };
  const weightHandler = (e) => {
    e.preventDefault();
    setWeight(e.target.value);
  };
  const sendWorkoutToBeEdited = () => {
    let workoutObject = {
      id : props.option, //propsien kautta saadaan tieto, mitä treeniä muokataan
      date : date,
      sport : sport,
      times : times,
      weight : weight,
      person : person,
      userType : usertype,
      token: token
  };
  editWorkout(workoutObject, errorContext.setAppError, userContext.setSuccess) //Lähetetään valittu treeni muokattavaksi
  };

  const closeErrorMessage = () => { //Kun painetaan rastia virheilmoituksessa, suljetaan virheilmoitus ja poistetaan virhe errorcontextista
    setShow(false);
    errorContext.setAppError(null);
  };

  if(userContext.Success===true){
    editSuccess = (
      <Alert variant="success">
        Treenin muokkaaminen onnistui!
    </Alert>
    );
  }
    return(
        <>
          {errorContext.appError && 
          <Alert variant="danger" onClose={() => closeErrorMessage()} dismissible>
            <Alert.Heading>Virhe</Alert.Heading>
            <p>
              {errorContext.appError}
            </p>
          </Alert>
          }
            <h6>Kirjoita kenttiin uudet tiedot</h6>
              <Form.Group>
             <Form.Label>Päivämäärä:</Form.Label>
                <Form.Control type="date" onChange={(e) => dateHandler(e)}/>
                <Form.Label>Laji:</Form.Label>
                <Form.Control type="text" placeholder="Syötä laji" onChange={(e) => sportHandler(e)}/>
                <Form.Label>Suorituskerrat:</Form.Label>
                <Form.Control type="number"  placeholder="Syötä suorituskerrat" onChange={(e) => timesHandler(e)}/>
                <Form.Label>Paino:</Form.Label>
                <Form.Control type="number"  placeholder="Syötä paino" onChange={(e) => weightHandler(e)}/>
              </Form.Group>
                <br />
                <Button onClick = {sendWorkoutToBeEdited}>Muokkaa</Button><br /><br />
                {editSuccess}
        </>
    )
}
export default EditWorkout;