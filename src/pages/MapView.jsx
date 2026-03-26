import { useLocation } from "react-router-dom";
import FloorMap from "../components/FloorMap";

export default function MapView() {
  const { state } = useLocation();

  return (
    <div className="map-view-page">
      <FloorMap 
        destination={state?.destination} 
        initialStart={state?.initialStart} // Ensure this name matches
      />
    </div>
  );
}