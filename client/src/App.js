import React from "react";
import 'antd/dist/antd.min.css';
import {DatePicker} from 'antd';
import './App.css';
import axios from 'axios';
import Home from "./Home";

function App() {
  axios.get("http://localhost:5000/location").then((resp)=>{
    console.log(resp);
  })
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
