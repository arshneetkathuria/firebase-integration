// import { Map,Marker, GoogleApiWrapper } from 'google-maps-react';


function GoogleMap({ google, locations = [{ lat: 28.7041, lng: 77.1025 }] }) {
  return (<div>Hello</div>
    // <Map
     
    //       google={google}
    //       containerStyle={{
    //           position: "static",
    //           width: "50%",
    //           height: "100%"
    //       }}
    //       style={{
    //           width: "100%",
    //           height: "100%"
    //       }}
    //       center={locations[0]}
    //       initialCenter={locations[0]}
    //       zoom={locations.length === 1 ? 18 : 13}
    //       disableDefaultUI={true}
    //   >
    //       {locations.map(
    //           coords => <Marker  key={locations[0]} position={coords} />
    //       )}

    //   </Map>
  );
};
export default GoogleMap;

// export default GoogleApiWrapper({
//   apiKey: process.env.GOOGLE_API_KEY
// })(CustomMap);