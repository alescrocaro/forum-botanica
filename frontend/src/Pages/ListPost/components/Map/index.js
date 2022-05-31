import React from 'react';
import { Mapa } from './style';

import "leaflet/dist/leaflet.css";
import L from 'leaflet';

import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

class Map extends React.Component {
    constructor(props){
        super(props);
    }

    getIcon(kingdom){
        let iconURL = iconMarker;
        
        if(kingdom === 'Plantae') iconURL = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
        else if(kingdom === 'Animalia') iconURL = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
        else if(kingdom === 'Fungi') iconURL = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'
        else if(kingdom === 'Chromista') iconURL = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'
        else if(kingdom === 'Protozoa') iconURL = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png'
        else if(kingdom === 'Bacteria') iconURL = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'
        
        return L.icon({ 
            iconRetinaUrl:iconRetina, 
            iconUrl: iconURL, 
            shadowUrl: iconShadow,
            iconSize: [25,41],
            iconAnchor: [12,41],
            popupAnchor: [0, -41]
        });
    }

    componentDidMount(){
        // LEAFLET ----------------------------------------------------------------------
        var map = L.map('map').locate({setView: true, maxZoom: 9, enableHighAccuracy: true});//setView([0, 0], 6);
        
        L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
            attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases">CyclOSM</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        this.props.posts.map((post) => {
            const position = post.latlng ? [post.latlng.coordinates[1], post.latlng.coordinates[0]] : [0,0];                    
            L.marker(position, {icon: this.getIcon(post.kingdom)})
                .addTo(map)
                .bindPopup(`<h5 style='margin: 0 0 .5em 0'><a href='/posts/${post.id}'>${post.title}</a></h5>
                            <p style='margin: 0'>Lat: ${position[1].toFixed(5)}<br/>
                            Lng: ${position[0].toFixed(5)}</p>`);
        });

        map.once('locationerror', () => {        
            map.setView([-15, -48], 4);      
        });
        // LEAFLET ----------------------------------------------------------------------
    }

    render(){
        return(
            <Mapa id='map'/>
        );
    }
}

export default Map;