import axios from "axios";
import {DatePicker, Form, Button} from 'antd'
import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from "react";
import Marker from "./Marker";
import moment from 'moment'
export default function Home() {
  const [result, setResult] = useState([]);
  const [form] = Form.useForm();
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  const onFinish = async(val)=>{
    setIsTrackLoading(true);
    var value = moment(val.date).unix();
    console.log(value);

    await axios.post("http://localhost:5000/location", {"timeStamp":value})
    .then((resp) => {
      setIsTrackLoading(false);
      console.log(resp.data);
      setResult(resp.data);
    });
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
            return (
              <Marker
                key={key}
                lat={val.latitude}
                lng={val.longitude}
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
        initialValues={{date: moment()}}
      >
        <Form.Item label="Date" name="date" >
          <DatePicker  showTime />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={isTrackLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
