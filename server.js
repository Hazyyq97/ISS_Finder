const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(express.json());
app.use(cors());

app.post("/location", async(req, res)=>{
    let {timeStamp} = req.body;
    let tempPrevious = timeStamp;
    let tempAfter = timeStamp;

    console.log(timeStamp);
    var previousHourTS=[];
    var nextHourTS = [];

    for (let i = 0; i < 6; i++) {
      tempPrevious = tempPrevious - 600; //10 mins * 60 secs
      tempAfter = tempAfter + 600;
      previousHourTS[i] = tempPrevious;
      nextHourTS[i] = tempAfter;
    }

     axios.get("https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps="+previousHourTS+","+timeStamp+","+nextHourTS

    )
    .then((resp)=>{
      res.send(resp.data);
    })
  })

  app.get("/people_location", async (req, res) => {
    axios
      .get("http://api.open-notify.org/astros.json")
      .then((response) => {
        // console.log(response.data);
        res.send(response.data);
      })
  });

  app.listen(5000,()=>console.log('server started'))