import axios from 'axios';
const baseUrlUsers = 'http://localhost:5000/api/users';
const baseUrlResults = 'http://localhost:5000/api/results';

const addWorkout = async (workoutObject, setAppError, setSuccess) => { //Uuden treenin lisääminen
    const config = {
        method: 'post',
        url: baseUrlResults + '/' + workoutObject.person + '/',
        headers: {Authorization: 'Bearer ' + workoutObject.token},
        data: workoutObject
    };
    try {
        let res = await axios(config);
        setSuccess(true);
        return res.data;
    } catch (error){
        setAppError("Virhe treenin lisäämisessä, yritä uudelleen!");
        return;
    };
};

const deleteWorkout = async (workoutObject, setAppError) => { //Treenin poistaminen
    const config = {
        method: 'delete',
        url: baseUrlResults + '/' + workoutObject.option + '/',
        headers: {Authorization: 'Bearer ' + workoutObject.token},
        data: workoutObject
    };
    try {
        let res = await axios(config);
        return res.data;
    } catch (error){
        setAppError("Virhe treenin poistamisessa, yritä uudelleen!");
        return;
    };
};

const editWorkout = async (workoutObject, setAppError, setSuccess) => { //Treenin muokkaaminen
    const config = {
        method: 'patch',
        url: baseUrlResults + '/' + workoutObject + '/',
        headers: {Authorization: 'Bearer ' + workoutObject.token},
        data: workoutObject
    };
    try {
        let res = await axios(config);
        setAppError(null);
        setSuccess(true);
        return res.data;
    } catch (error){
        setAppError("Virhe treenin muokkaamisessa, yritä uudelleen!");
        return;
    };
};

const getProfessionalsResults = async (token, setAppError) => { //Haetaan ammattilaisten treenit
    const config = {
        method: 'get',
        url: baseUrlResults + '/professionals/',
        headers: {Authorization: 'Bearer ' + token}
    };
    try {
        let res = await axios(config);
        return res.data;
    } catch (error){
        setAppError("Virhe tietojen haussa, yritä uudelleen myöhemmin!");
        return;
    };
};

const getResultsByUser = async (workoutObject) => { //Haetaan kirjautuneen käyttäjän treenit
    const config = {
        method: 'post',
        url: baseUrlResults + '/own-results/' + workoutObject.email + '/',
        headers: {Authorization: 'Bearer ' + workoutObject.token},
        data: workoutObject
    };
    try {
        let res = await axios(config);
        return res.data;
    } catch (error){
        console.log("User has no excercises yet");
        return;
    };
}

const getAmateursResults = async (setAppError) => { //Haetaan harrastajien treenit
    const config = {
        method: 'get',
        url: baseUrlResults + '/amateurs/',
        headers: {}
    };
    try {
        let res = await axios(config);
        return res.data;
    } catch (error){
        setAppError("Virhe tietojen haussa, yritä uudelleen myöhemmin!");
        return;
    };
};


const register = async (newObject, setAppError, setSuccess) =>{ //Rekisteröidytään
    await axios.post(`${baseUrlUsers}/register/`, newObject)
    .then(response => {
        setSuccess(true);
        return response;
    })
    .catch (error => {
            setAppError("Rekisteröityminen epäonnistui, yritä uudelleen!");
            return "virhe";
    })
}

const login = async (newObject, setAppError, login) => { //Kirjaudutaan sisään
    let res = await axios.post (`${baseUrlUsers}/login/`, newObject)
    .then(response =>{
        console.log(response);
        login(response.data.token, response.data.email, response.data.firstname, response.data.userType);
    })
    .catch (error => {
        setAppError("Sisäänkirjautuminen epäonnistui, yritä uudelleen!");
        return "virhe";
    })
}

const logout = (logout) => { //Kirjaudutaan ulos
    logout();
}

export {getAmateursResults, getProfessionalsResults, addWorkout, deleteWorkout, editWorkout, register, login, logout, getResultsByUser}
