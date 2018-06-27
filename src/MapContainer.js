import React, { Component } from 'react';
import ReactDOM from 'react-dom'


export default class MapContainer extends Component {

// All the Restaurants added to state
  state = {
    restaurants: [
      { name: "Roadhouse", location: {lat: 27.676076, lng: 85.313031} },
      { name: "Sam's One Tree", location: {lat: 27.710301, lng: 85.317054} },
      { name: "Redmud", location: {lat: 27.676751516095695, lng: 85.31057327985764} },
      { name: "Fire and Ice", location: {lat: 27.713862, lng: 85.313557} },
      { name: "Himalayan Java", location: {lat: 27.70375981925266, lng: 85.30759583000776} } ,
    ],
    map: '',
    markers: [],
    defaultMarkers: [],
    previousMarker: '',
    infowindow: '',
    name : '',
    isOpen: true
  }

  componentDidMount() {
    this.loadMap();
  }
 // Sidebar is Toggled
  toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('close')
    if (document.getElementById('sidebar').className === 'close') {
      this.setState({ isOpen: false })
    }
    this.state.infowindow.close();
  }

  // Google map is loaded using Google-map-react, reference https://medium.com/front-end-hacking/simplified-google-maps-api-in-a-react-app-46981441d2c9
  loadMap() {

  // Initializtion of Google Map
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

      // Bounds used for enabling responsiveness for various devices, reference https://stackoverflow.com/questions/1556921/google-map-api-v3-set-bounds-and-center
      var bounds = new google.maps.LatLngBounds();
      var restaurantList = [];
      this.state.restaurants.forEach(res => {
        var marker = new google.maps.Marker({
          position: {
            lat: res.location.lat,
            lng: res.location.lng
          },
          map: this.map,
          title: res.name,
          animation: window.google.maps.Animation.DROP
        })
        restaurantList.push(marker);
        var tempMarkers = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

        console.log(marker);

        // Boundary extended for each Marker
        bounds.extend(tempMarkers);

        // EventListener for opening infowindow for each marker
        google.maps.event.addListener(marker,'click',()=> {
        this.openInfoWindow(marker);
        })
      })
        this.setState({
        markers: restaurantList,
        defaultMarkers: restaurantList
      })

      // Reset zoom and reszie according to marker , reference :https://stackoverflow.com/questions/8558226/recenter-a-google-map-after-container-changed-width
      var currentCenters = this.map.getCenter();
      console.log(currentCenters);
      google.maps.event.addDomListener(window, 'resize', ()=> {
        this.map.setCenter(currentCenters);
        this.map.fitBounds(bounds);
        this.map.panToBounds(bounds);
      });

      // InfoWindow created for each Marker
      var infowindow = new google.maps.InfoWindow({ maxWidth: 250 });
      this.setState({ infowindow:infowindow })
    }
  }

  openInfoWindow = (marker) => {
    console.log(this.state.previousMarker);
    // Animation start and close for each Marker
    if (this.state.previousMarker) { this.state.previousMarker.setAnimation(null); }
        this.setState({  'previousMarker': ''});
    this.setState({ 'previousMarker': marker });
    marker.setAnimation(window.google.maps.Animation.BOUNCE);

    this.map.setCenter(marker.getPosition());
    // Foursquare API Keys
    var clientId = 'AVL0E0YPFXY4F03WZUFKTBITTSICNP3J3NFF2ANLNB5NQDIW'
    var clientSecret = 'LWMGBBA153TJ0FKKMTYVUKO0WG2BXFLW1YTFNCKVYVTMUH2L'
    // Latitude and longitude of each marker
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();

    this.state.infowindow.setContent("Fetching Foursquare Data")
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20180626&ll=" + lat + "," + lng + "&limit=1";
    fetch(url)
          .then( (initialResponse)=> {
                if (initialResponse.status != 200) {
                    this.state.infowindow.setContent("Foursquare API error");
                    return;
                }
                initialResponse.json().then((data)=> {
                var resp_data = data.response.venues[0]; // Initial initialResponse from Foursquare API
                console.log(resp_data);
                url = "https://api.foursquare.com/v2/venues/" + resp_data.id + "/?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20180626";
                fetch(url)
                .then((finalResponse) => {
                     if (finalResponse.status != 200) {
                         this.state.infowindow.setContent("");
                         var restaurant_details = resp_data;
                         console.log(restaurant_details); // Response if Premium Calls exceeded
                         var name = '<b> Name of Restuarant : </b>' + restaurant_details.name + '<br>';
                         var category = '<b> Restuarant Category : </b>' + restaurant_details.categories[0].name + '<br>';
                         var address = '<b> Address of Restuarant : </b>' + restaurant_details.location.address + '<br>';
                         var moreDetails = '<a href="https://foursquare.com/v/'+ restaurant_details.id +'" target="_blank">More Details on Foursquare Website</a>' + '<br>';
                         var error = "<b> Foursquare Premium Quota (500 Calls per Day) exceeded so Restaurant Rating can't be displayed. </b>";
                         this.state.infowindow.setContent(name + category + address + moreDetails + error);
                         return;
                        }
                        finalResponse.json().then(data=>{
                              var restaurant_details = data.response.venue;
                              console.log(restaurant_details); // Response if Premium Call allowed
                              var name = '<b> Name of Restuarant : </b>' + restaurant_details.name + '<br>';
                              var rating = '<b> Rating of Restuarant : </b>' + restaurant_details.rating + '<br>';
                              var category = '<b> Restuarant Category : </b>' + restaurant_details.categories[0].name + '<br>';
                              var address = '<b> Address of Restuarant : </b>' + restaurant_details.location.address + '<br>';
                              var moreDetails = '<a href="https://foursquare.com/v/'+ restaurant_details.id +'" target="_blank">More Details on Foursquare Website</a>'
                              // Details for InfoWindow for each Marker
                              this.state.infowindow.setContent(name + rating + category + address + moreDetails);
                            })
                        })
                        .catch(function (err){
                          alert("Foursquare API Error");
                        });
                    });
                })
            .catch(function (err) {
                this.state.infowindow.setContent("Foursquare API Error");
            });
        // Open infowindow for marker on click
        this.state.infowindow.open(this.state.map,marker);
  }

  // Search Filter
  searchFilter = (event) => {
    this.state.infowindow.close();
    var restaurantList = [];
    if (event.target.value === '' || restaurantList.length === 0) {
      this.state.defaultMarkers.forEach((marker) => {
        if (marker.title.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
          marker.setVisible(true);
          restaurantList.push(marker);
        } else {
          marker.setVisible(false);
        }
      });
    }
    else {
      this.state.markers.forEach((marker) => {
        if (marker.title.toLowerCase().indexOf(event.target.value) >= 0) {
          marker.setVisible(true);
          restaurantList.push(marker);
        } else {
          marker.setVisible(false);
        }
      });
    }
    this.setState({
      markers: restaurantList
    })
  }


  render() {
    const style = {
      height: window.innerHeight + "px",
      position : 'relative'
    }

    return (
      <div>
      <div id="header">
            <h1 id= "title"> Restaurants in Kathmandu </h1>
            <span id = "hamburger" onClick = {this.toggleSidebar} >&#x2630;</span>
      </div>
      <div>
      {/* Sidebar populated with Restaurants */}
      <div id = "sidebar" >
            <input type = "search" placeholder = "Filter..." id = "search" onChange = {this.searchFilter} />
            <ul id = "restaurant-list" >
            {
              this.state.markers.map((mark,index) => {
              return ( < li key = {index} className = "restaurants"
              onClick = {this.openInfoWindow.bind(this,mark)}
              value = { this.state.name}
              tabIndex = {this.isOpen ? -1 : 0} >
              {mark.title} < /li>)
            })
            }
            </ul>
      </div>
      </div>
      <div id = "map-container" >
      <div ref="map" id="map" style={style}>
        Loading Map...
      </div>
      </div>
      </div>
    )
  }
}
