<template>
  <div id="googleMapComponent">
    <div id="map"></div>
  </div>
</template>
<script>
  export default {
    components: {},
    props: {
      defaultCenter: {
        default: () => {
          return {lat: 4.4418993, lng: -75.2128882}
        }
      },
      defaultCityId: {default: 957},// Ibague City
      mapData: {default: false},
      mapType: {default: 'route'}
    },
    watch: {
      defaultCityId(newValue) {
        if (newValue) this.setMapCenter()
      },
      markers() {
        this.emitResponse
      },
      distance() {
        this.emitResponse
      },
      startAddress() {
        this.emitResponse
      },
      endAddress() {
        this.emitResponse
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        map: {},
        markers: [],
        polylines: [],
        directionsService: {},
        rendererOptions: {
          polylineOptions: {
            strokeWeight: 6,
            strokeOpacity: 1,
            strokeColor: this.$store.getters['qsiteApp/getSettingValueByName']('isite::brandWarning')
          },
          preserveViewport: true,
          suppressMarkers: true,
          draggable: true
        },
        directionsRenderer: {},
        customStyleMap: [
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ],
        startAddress: '',
        endAddress: '',
        distance: 0,
        overviewPolyline: '',
        route: {},
      }
    },
    computed: {
      waypts() {
        var waypts = [];

        // MAPING MARKERS FOR PARSING TO WAYPOINTS
        this.markers.forEach((marker, index) => {
          //  if (index != 0 && index != this.markers.length - 1)
          waypts.push({
            lat: marker.position.lat(),
            lng: marker.position.lng()
          });
        })

        return waypts
      },

      emitResponse() {
        let response = {
          markers: this.waypts
        }
        this.$emit('input', response)
      },
      cities() {
        return this.$store.state.appMaster.cities
      }
    },
    methods: {
      async init() {
        //Load CDN google maps
        this.$helper.loadGoogleMaps(this.$store.getters['qsiteApp/getSettingValueByName']('isite::api-maps'))
        setTimeout(() => {
          if (this.mapData) this.initMapLoadRoute()
          else this.initMap()
        }, 1000)
      },
      //SET MAP CENTER, FOR CITIES SELECT
      setMapCenter() {
        setTimeout(() => {
          this.initMap()
          setTimeout(() => {
            let city = this.cities.find(city => city.id == this.defaultCityId)
            this.map.setCenter(city.geoLocation)
            this.map.setZoom(13);
          }, 500)
        }, 500)
      },
      //Init Map
      initMap() {
        setTimeout(() => {
          this.markers = []
          this.route = {}
          this.startAddress = ''
          this.endAddress = ''
          this.distance = 0

          var customMapType = new google.maps.StyledMapType(this.customStyleMap, {name: 'Custom Style'});
          var customMapTypeId = 'custom_style';
          // GOOGLE MAP INITIALIZE
          this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: this.defaultCenter,
            mapTypeControl: false,
            streetViewControl: false,
          });

          this.map.mapTypes.set(customMapTypeId, customMapType);
          this.map.setMapTypeId(customMapTypeId);

          // CLICK LISTENER FOR MARKERS
          google.maps.event.addListener(this.map, 'click', (event) => {
            if (this.mapType == 'route' || this.markers.length < 1)
              this.placeMarker(event.latLng);
          });

        }, 1000)
      },
      //Init map load route
      initMapLoadRoute() {
        let markers = this.mapData;

        var customMapType = new google.maps.StyledMapType(this.customStyleMap);
        var customMapTypeId = 'custom_style';

        //Create LatLngBounds object.
        var latlngbounds = new google.maps.LatLngBounds();

        markers.forEach(marker => {
          latlngbounds.extend(marker);
        });
        // GOOGLE MAP INITIALIZE
        this.map = new google.maps.Map(document.getElementById('map'), {
          //zoom: 13,
          center: this.defaultCenter,
          mapTypeControl: false,
          streetViewControl: false,
        });

        this.map.mapTypes.set(customMapTypeId, customMapType);
        this.map.setMapTypeId(customMapTypeId);

        this.map.setCenter(latlngbounds.getCenter());


        if (this.mapType == 'route') {
          this.map.fitBounds(latlngbounds);
          var flightPath = new google.maps.Polyline({
            path: markers,
            geodesic: true,
            strokeColor: this.$store.getters['qsiteApp/getSettingValueByName']('isite::brandPrimary'),
            strokeOpacity: 1.0,
            strokeWeight: 6
          });
          this.polylines.push(flightPath);
          flightPath.setMap(this.map);
        } else {
          var marker = new google.maps.Marker({
            position: this.mapData[0],
            map: this.map,
            draggable: false
          });
          this.map.setZoom(16)
        }


      },
      //CREATION AND ADDITION MARKER ON MAP
      placeMarker(location) {
        var marker = new google.maps.Marker({
          position: location,
          map: this.map,
          draggable: true
        });

        this.markers.push(marker)
        google.maps.event.addListener(marker, 'dragend', (evt) => {
          this.calculateAndDisplayRoute(true)
        });
        this.calculateAndDisplayRoute()
      },
      //CALCULATE AND DISPLAY ROUTE, IN GOOGLE MAP
      calculateAndDisplayRoute(flush = false) {
        // GETTING ROUTE
        /*
        this.directionsService.route({
          origin: this.markers.length ? this.markers[0].position : false,
          destination: this.markers.length ? this.markers[this.markers.length - 1].position : false,
          waypoints: this.waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            this.directionsRenderer.setDirections(response);
            var route = response.routes[0];
            this.route = route
            this.distance = 0
            // For each route, display summary information.

            for (var i = 0; i < route.legs.length; i++) {
              if (i == 0)
                this.startAddress = route.legs[i].start_address
              if (i == (route.legs.length - 1))
                this.endAddress = route.legs[i].end_address
              this.distance += route.legs[i].distance.value
            }

          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
        */
        if (flush) {
          this.polylines.forEach(line => {
            line.setMap(null)
          })
        }

        var flightPath = new google.maps.Polyline({
          path: this.waypts,
          geodesic: true,
          strokeColor: this.$store.getters['qsiteApp/getSettingValueByName']('isite::brandPrimary'),
          strokeOpacity: 1.0,
          strokeWeight: 6
        });
        this.polylines.push(flightPath);
        flightPath.setMap(this.map);


      },
    }
  }
</script>
<style lang="stylus">
  #googleMapComponent
    width 100%

    #map
      height 300px
</style>
