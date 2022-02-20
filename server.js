const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(express.json());
app.use(cors());

app.get("/location", (req, res)=>{
    let {timeStamp} = req.body;
    axios.get("https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=436029892,1436029902&units=miles"
    )
    .then((resp)=>{
      res.send(resp.data);
    })
  })

  app.listen(5000,()=>console.log('server started'))