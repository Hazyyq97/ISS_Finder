export default function Marker(props){
    const { color, name, id } = props;
    return (
      <div
        className="marker"
        style={{ backgroundColor: color, cursor: "pointer" }}
        title={name}
      />
    );
}