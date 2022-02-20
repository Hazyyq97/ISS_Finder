import axios from "axios";
import {DatePicker, Form, Button, Table, Row, Col} from 'antd'
import GoogleMapReact from 'google-map-react';
import { useState } from "react";
import Marker from "./Marker";
import moment from 'moment'
export default function Home() {
  const [result, setResult] = useState([]);
  const [otherPeopleResult, setOtherPeopleResult] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [form] = Form.useForm();
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [isPeopleLoading, setIsPeopleLoading] = useState(false);

  const columns = [
    {
      title: 'No', 
      dataIndex: 'key',
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

  const onFinish = async(val)=>{
    setShowTable(true);
    setIsTrackLoading(true);
    getPeople();
    var value = moment(val.date).unix();

    await axios.post("http://localhost:5000/location", {"timeStamp":value})
    .then((resp) => {
      
      setIsTrackLoading(false);
      // console.log(resp.data);
      setResult(resp.data);

      for(var v in resp.data){
        var lat = resp.data[v].latitude;
        var long = resp.data[v].longitude;
        getLocation(lat, long)
      }
    });
  }
  
  const getLocation=async(lat, lng, data)=>{
    await axios.post("http://localhost:5000/country",{"lat": lat, "lng": lng})
    .then((resp)=>{
      console.log("Country Code",resp.data);
    })
  }
   
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
                date ={new Date(val.timestamp*1000).toLocaleDateString()}
                time ={new Date(val.timestamp*1000).toLocaleTimeString()}
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
          <Button loading={isTrackLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Row>
        <Col span={9} offset={8}>
          {showTable && (
            <Table bordered loading={isPeopleLoading} dataSource={otherPeopleResult} columns={columns} />
          )}
        </Col>
      </Row>
    </>
  );
}
