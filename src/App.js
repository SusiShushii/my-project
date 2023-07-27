import React, {useState} from "react"
import CurrentLocation from './currentLocation'
import './App.css';
import Details from './deatil'
import ImageViewer from './ImageViewer'

function App() {
  return (
  <div>
    <div className="container">
    <CurrentLocation/>
    <ImageViewer/>
    </div>
    <Details/>

  </div>
);
}

export default App;
