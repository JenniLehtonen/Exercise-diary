import React, {useContext, useState} from 'react';
import {Button, Form, Alert} from 'react-bootstrap';
import {addWorkout} from '../user/services/user-services';
import UserContext from '../contexts/UserContext';
import ErrorContext from '../contexts/ErrorContext';

const AddWorkout = () => {
      const userContext = useContext(UserContext);
      const errorContext = useContext(ErrorContext);
      const [date, setDate] = React.useState('');
      const [sport, setSport] = React.useState('');
      const [times, setTimes] = React.useState('');
      const [weight, setWeight] = React.useState('');
      const [show, setShow] = useState(true); //Virheilmoituksen näyttämiseen
      let addSuccess = ""; //Alustetaan muuttuja, jotta ilmoitus treenin lisäämisen onnistumisesta pystytään näyttämään

      const person = userContext.Email; //Haetaan userContextista kirjautuneen henkilön sähköposti ja käyttäjätyyppi treenin lisäystä varten
      const usertype = userContext.UserType;
      const token = userContext.token;

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
      
    const sendWorkoutToDB = () => {
        let workoutObject = {
            date : date,
            sport : sport,
            times : times,
            weight : weight,
            person : person,
            userType : usertype,
            token: token
        };
        addWorkout(workoutObject, errorContext.setAppError, userContext.setSuccess) //Lähetetään uusi treeni tietokantaan
      };

      const closeErrorMessage = () => { //Kun painetaan rastia virheilmoituksessa, suljetaan virheilmoitus ja poistetaan virhe errorcontextista
        setShow(false);
        errorContext.setAppError(null);
      };

      if(userContext.Success===true){
        addSuccess = (
          <Alert variant="success">
            Treenin lisääminen onnistui!
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
            <Form>
                <h6>Kirjoita treenin tiedot alla oleviin kenttiin</h6>
                <Form.Label>Päivämäärä:</Form.Label>
                <Form.Control type="date" onChange={(e) => dateHandler(e)} />
                <Form.Label>Laji:</Form.Label>
                <Form.Control type="text" placeholder="Syötä laji" onChange={(e) => sportHandler(e)} />
                <Form.Label>Suorituskerrat:</Form.Label>
                <Form.Control type="number" placeholder="Syötä suorituskerrat" onChange={(e) => timesHandler(e)} />
                <Form.Label>Paino:</Form.Label>
                <Form.Control type="number" placeholder="Syötä paino" onChange={(e) => weightHandler(e)} />
                <br />
                <Button onClick = {sendWorkoutToDB}>Lisää</Button><br /><br />
                {addSuccess}
            </Form>
            
        </>
    )
}
export default AddWorkout;