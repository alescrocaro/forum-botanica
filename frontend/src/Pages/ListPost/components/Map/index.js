import React, {useMemo} from 'react';
import { Mapa } from './style';

import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useMap, useMapEvents } from 'react-leaflet/hooks'

import "leaflet/dist/leaflet.css";
import L, {latLngBounds} from 'leaflet';

import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const getIcon = (kingdom) =>{
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

export default function Map(props) {
    const startPosition = [0,0]

    let markers = []

    //muda o bound do mapa para mostrar todos os pinos
    const MostrarTodosOsPinos = (props) => {
        const map = useMap();
        const b = latLngBounds([[0, 0],[0,0]]);
        props.markers.forEach(coords => {
            b.extend(coords)
        })
        console.log(b);
        map.fitBounds(b);
    };

    //adicionar componente de clusterizaçao
    //https://www.npmjs.com/package/react-leaflet-markercluster

    return (
        <Mapa>
            <MapContainer center={startPosition} zoom={5} style={{width: '100%', height: '100%'}}>
                <TileLayer
                    attribution='<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases">CyclOSM</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
                />

                {props.posts.map((post) => {
                    const position = post.latlng ? [post.latlng.coordinates[1], post.latlng.coordinates[0]] : [0,0];                    
                    markers.push(position);
                        
                    return <Marker position={position} icon={getIcon(post.kingdom)}>
                        <Popup>
                            <h5 style={{margin: '0 0 .5em 0'}}><a href={`/posts/${post.id}`}>{post.title}</a></h5>
                            <p style={{margin: '0'}}>Lat: {position[1].toFixed(5)}<br/> Lng: {position[0].toFixed(5)}</p>
                            {console.log(post)}
                        </Popup>
                    </Marker>
                })}

                <MostrarTodosOsPinos markers={markers}/>

            </MapContainer>
        </Mapa>
    );
  }