import React from 'react';
import Footer from "./Footer"
import homePagePicture from '../homePagePicture.jpg';

const Etusivu = () => {
    
    return(
    <div style={{textAlign: "center"}}>
        <h1>TREENIPÄIVÄKIRJA</h1>
        <img src={homePagePicture} alt="stretching person" className="responsive"></img><br />
        <Footer/>
    </div>
    )
}
export default Etusivu;