import React, {useState, useEffect, useContext} from 'react';
import {Table, Alert} from 'react-bootstrap';
import {getProfessionalsResults} from '../user/services/user-services';
import UserContext from '../contexts/UserContext';
import ErrorContext from '../contexts/ErrorContext';
import _ from 'lodash';

const Ammattilaiset = () => {
    const errorContext = useContext(ErrorContext);
    const userContext = useContext(UserContext);
    const [show, setShow] = useState(true); //Virheilmoituksen näyttämiseen
    const [results, setResults] = useState([]);
    useEffect (() =>{
        getProfessionalsResults(userContext.token, errorContext.setAppError).then(response => setResults(response));
    }, [])

   var personsPerDay= _.map(_.countBy(results, "date"), (val, key) => ({ date: key, person: val })); //Lasketaan treenaajat päivittäin

   var pResult = _(results) //Ryhmittele tietokannan tiedot päivittäin ja laske treenien määrä päivittäin
        .groupBy(x => x.date)
        .map((value, key) => 
        ({date: key,
        results: _.sumBy(value,'times'),
        users: value})).value();

    const professionalsResults = pResult.map((result, index) => {
        const persons = personsPerDay[index];
        return (
               <tr key={index}><td>{result.date.slice(0, 10).replaceAll("-", ".")}</td><td>{result.results}</td><td>{persons.person}</td></tr>
        );
      });
    
    const closeErrorMessage = () => { //Kun painetaan rastia virheilmoituksessa, suljetaan virheilmoitus ja poistetaan virhe errorcontextista
    setShow(false);
    errorContext.setAppError(null);
    };

    return(
        <>
        {errorContext.appError==="Virhe tietojen haussa, yritä uudelleen myöhemmin!" && 
        <Alert variant="danger" style={{width: "50%", margin: "auto", marginBottom: "1rem"}} onClose={() => closeErrorMessage()} dismissible>
        <Alert.Heading>Virhe</Alert.Heading>
        <p>
          {errorContext.appError}
        </p>
        </Alert>
        }
        <h2 style={{textAlign: "center"}}>Ammattilaiset</h2><br />
        <div id="table-div">
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>Pvm</th>
                    <th>Suoritukset yhteensä</th>
                    <th>Suorittajalkm</th>
                </tr>
            </thead>
            <tbody>
                {professionalsResults}
            </tbody>
            </Table>
        </div>
        </>
    )
}
export default Ammattilaiset;