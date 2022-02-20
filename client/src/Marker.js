export default function Marker(props){
    const { color, name, lat, lng, date, time } = props;
    return (
      <div>
        <div
          className="marker"
          style={{ backgroundColor: color, cursor: "pointer" }}
          title={name}
        />
        <div style={{paddingLeft: "10px", fontWeight: "bold"}}>
          <div>
          <p>Coordinate: {lat + " " + lng}</p>
          </div>
          <p>Date: {date}</p>
          <p>Time: {time}</p>
        </div>
      </div>
    );
}