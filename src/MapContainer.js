import React, { Component } from 'react';
import ReactDOM from 'react-dom'


export default class MapContainer extends Component {

  state = {
    locations: [
      { name: "Roadhouse Cafe", location: {lat: 27.6734622, lng: 85.3137894} },
      { name: "Sam's One Tree Cafe", location: {lat: 27.7103032, lng: 85.3165058} },
      { name: "Brick's Cafe", location: {lat: 27.6835571, lng: 85.3232308} },
      { name: "Everest Steak House", location: {lat: 27.7122834, lng: 85.3297539} },
      { name: "The Art's Cafe", location: {lat: 27.7054112, lng: 85.2971168} }
    ]
  }

  componentDidMount() {
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      const mapConfig = Object.assign({}, {
        center: {lat: 27.674463, lng: 85.313183},
        zoom: 13,
        mapTypeId: 'roadmap'
      })

      this.map = new maps.Map(node, mapConfig);


      this.state.locations.forEach( location => {
        const marker = new google.maps.Marker({
          position: {lat: location.location.lat, lng: location.location.lng},
          map: this.map,
          title: location.name
        });
      })

    }
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }

    return (
      <div ref="map" style={style}>
        loading map...
      </div>
    )
  }
}
