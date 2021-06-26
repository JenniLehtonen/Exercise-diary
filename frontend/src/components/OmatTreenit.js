import React, {useState, useContext, useEffect} from 'react';
import {Table, Modal, Button, Alert} from 'react-bootstrap';
import AddWorkout from '../components/AddWorkout';
import EditWorkout from '../components/EditWorkout';
import UserContext from '../contexts/UserContext';
import ErrorContext from '../contexts/ErrorContext';
import {getResultsByUser, deleteWorkout} from '../user/services/user-services';


const OmatTreenit = () => {
    const userContext = useContext(UserContext);
    const errorContext = useContext(ErrorContext);
    const [showAdd, setShowAdd] = useState(false); //Modaalin dialogin näkyvyys
    const [showEdit, setShowEdit] = useState(false); //Modaalin dialogin näkyvyys
    const [results, setResults] = useState([]);
    const [show, setShow] = useState(true); //Virheilmoituksen näyttämiseen
    const [option, setOption] = useState(" "); //Tämän avulla lähetetään valitun treenin id komponentille, jossa muokataan treenien tietoja
  
    const person = userContext.Email; //Treenin poistamista varten
    const token = userContext.token;

    let workouts = {
      email: person, //haetaan kirjautuneen käyttäjän sähköpostiosoite contextista, ja sen avulla haetaan käyttäjän omat treenit tietokannasta
      token: token //lähetetään myös token ja jos kaikki on kunnossa, näytetään käyttäjän omat tulokset
    };

    useEffect (() =>{
        getResultsByUser(workouts).then(response => setResults(response));
    }, [])
    
    const sendWorkoutToBeDeleted = (option) => { //Lähetetään treeni poistettavaksi
      let workoutObject = {
        option: option,
        person: person,
        token: token
    };
    let newResults;
      deleteWorkout(workoutObject, errorContext.setAppError); //Lähetetään valittu treeni poistettavaksi
      newResults = results.filter(function(obj) { //Luodaan uusi array, josta poistetaan valittu treeni
        return obj._id !== option;
    });
      setResults(newResults); //Tallennetaan stateen uusi array
    };

    const closeModalWindow = () => { 
      errorContext.setAppError(null); //Tyhjennetään mahdolliset treenien muokkaamisessa jne. tulleet virheet errorContextista
      userContext.setSuccess(false); //Asetetaan success-tila falseksi, kun modaali ikkuna suljetaan
      setShowAdd(false); //Suljetaan modaalinen ikkuna
      setShowEdit(false);
    };

    const closeErrorMessage = () => { //Kun painetaan rastia virheilmoituksessa, suljetaan virheilmoitus ja poistetaan virhe errorcontextista
      setShow(false);
      errorContext.setAppError(null);
    };
console.log(results);
    function AddWorkouts(props) {

        return (
          <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Lisää uusia treenejä
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {<AddWorkout />}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={closeModalWindow}>Sulje</Button>
            </Modal.Footer>
          </Modal>
        );
      }

      function EditWorkouts(props) {

        return (
          <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Muokkaa omia treenejä
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {<EditWorkout option={option} />}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={closeModalWindow}>Sulje</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      
    return(
        <>
        {errorContext.appError==="Virhe treenin poistamisessa, yritä uudelleen!" && 
        <Alert variant="danger" style={{width: "50%", margin: "auto", marginBottom: "1rem"}} onClose={() => closeErrorMessage()} dismissible>
        <Alert.Heading>Virhe</Alert.Heading>
        <p>
          {errorContext.appError}
        </p>
      </Alert>
        }
        <>
          <AddWorkouts
            show={showAdd}
            onHide={closeModalWindow}
          />
        </>
        <>
          <EditWorkouts
            show={showEdit}
            onHide={closeModalWindow}
          />
        </>
        <h3 id="username">Omat treenit: {userContext.Firstname}</h3>
        <Button id="editWorkoutButton" variant="primary" onClick={() => setShowAdd(true)}>Lisää treenejä</Button>
        <div id="table-div">
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Pvm</th>
                    <th>Laji</th>
                    <th>Suorituskerrat</th>
                    <th>Paino</th>
                    </tr>
                </thead>
                <tbody>
                    {results && results.map((result, index) => {
                      return <tr key={index}><td>{result.date.slice(0, 10).replaceAll("-", ".")}</td><td>{result.sport}</td><td>{result.times}</td><td>{result.weight}</td><td className="removeButton"><Button onClick={() => sendWorkoutToBeDeleted(result._id)}>Poista</Button><Button id="editButton" onClick={() => {setShowEdit(true); setOption(result._id)}}>Muokkaa</Button></td></tr>;
                   })}
                </tbody>
            </Table>
        </div>
        </>
    )
}
export default OmatTreenit;