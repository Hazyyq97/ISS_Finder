import axios from "axios";
import {DatePicker, Form, Button, Table, Row, Col, Space} from 'antd'
import GoogleMapReact from 'google-map-react';
import { useState } from "react";
import Marker from "./Marker";
import moment from 'moment'
export default function Home() {
  const [result, setResult] = useState([]);
  const [otherPeopleResult, setOtherPeopleResult] = useState([]);
  const [locResult, setLocResult] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showLoc, setShowLoc] = useState(false);
  const [form] = Form.useForm();
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [isPeopleLoading, setIsPeopleLoading] = useState(false);
  const [isLocLoading, setIsLocLoading] = useState(false);

  const columns = [
    {
      title: 'No', 
      dataIndex: 'key',
      key: 'key',
      render: (text,record)=>
      <label>{otherPeopleResult.indexOf(record) + 1}</label>
    },
    {
      title: 'Craft',
      dataIndex: 'craft',
      key: 'craft',
    }, 
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }
  ]

  const columnsLoc = [

    {
      title: "Country Code",
      dataIndex: 'country_code',
      key: 'country_code',
    },
    {
      title: "Timezone", 
      dataIndex: 'timezone_id',
      key: 'timezone_id'
    }
  ]

  const getPeople=async()=>{
    setIsPeopleLoading(true);
    await axios("http://localhost:5000/people_location")
    .then((resp)=>{
      // console.log("Other people",resp.data.people);
      var result = [];
        for (var i = 0; i < resp.data.people.length; i++) {
          resp.data.people[i].key = i;
        }
        for (var a in resp.data.people) {
          result.push(resp.data.people[a]);
        }
        // console.log(result)
      setOtherPeopleResult(result);
      setIsPeopleLoading(false)
    })
  }

  const onFinish = (val)=>{
    setShowTable(true);
    setIsLocLoading(true);
    setIsTrackLoading(true);
    getPeople();
    var value = moment(val.date).unix();

     axios.post("http://localhost:5000/location", {"timeStamp":value})
    .then((resp) => {
      
     
      // console.log(resp.data);
      setResult(resp.data);
      var otherLoc=[];

      resp.data.map((val)=>{
       axios.post("http://localhost:5000/country", {"lat": val.latitude, "lng": val.longitude})
        .then((response)=> {
          
          console.log(response.data)
          otherLoc.push(response.data)
        })
      })
      setIsTrackLoading(false);
      setIsLocLoading(false);
      setLocResult(otherLoc);
      console.log("Other location",locResult)
   
    });
  }

  const GetLocationSubmit=()=>{
    setShowLoc(true);
    console.log(locResult)
  }


  
  
  // const getLocation=async(lat, lng)=>{
  //   await axios.post("http://localhost:5000/country",{"lat": lat, "lng": lng})
  //   .then((resp)=>{
  //     console.log("Country Code",resp.data);
  //     // setLocResult(resp.data)
  //   })
  // }
   
  return (
    <>
      <div
        style={{ height: "80vh", width: "100vw", paddingBottom: "10px" }}
        className="map-container"
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyBvbcIC2I9QjQxZp0YqS2WeX8kysRrP-ds",
          }}
          defaultZoom={2}
          defaultCenter={{ lat: 10.99835602, lng: 77.01502627 }}
        >
          {result.map((val, key) => {
            // console.log(new Date(val.timestamp*1000).toLocaleDateString() , new Date(val.timestamp*1000).toLocaleTimeString())
            return (
              <Marker
                key={key}
                lat={val.latitude}
                lng={val.longitude}
                date={new Date(val.timestamp * 1000).toLocaleDateString()}
                time={new Date(val.timestamp * 1000).toLocaleTimeString()}
                name="My Marker"
                color="red"
              />
            );
          })}
        </GoogleMapReact>
      </div>
      <Form
        onFinish={onFinish}
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ date: moment() }}
      >
        <Form.Item label="Date" name="date">
          <DatePicker showTime />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space>
            <Button loading={isTrackLoading} type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={GetLocationSubmit}>Location</Button>
          </Space>
        </Form.Item>
      </Form>
      <Row>
        <Col style={{ paddingRight: "10px" }} span={4} offset={6}>
          {console.log("loc result here =>", locResult)}
          {showLoc && (
            <Table
              bordered
              loading={isLocLoading}
              dataSource={locResult}
              columns={columnsLoc}
            />
          )}
        </Col>
        <Col span={9}>
          {showTable && (
            <Table
              bordered
              loading={isPeopleLoading}
              dataSource={otherPeopleResult}
              columns={columns}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
