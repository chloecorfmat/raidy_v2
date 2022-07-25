import L, { LatLng, Map, Marker, Polyline } from 'leaflet';
import { useEditorStore } from '../stores/editorStore';

export default class LeafletService {
    // Initiate map (should be saved in a store).
    public createMap(lat :any, lng :any) {
        let map: Map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        return map;
    }

    // Add marker on a map.
    public addMarker(map :Map, latlng :LatLng, draggable :boolean) {
        return L.marker(latlng, { draggable: draggable }).addTo(map);
    }

    public removeMarker(map :Map, marker :Marker) {
        map.removeLayer(marker);
    }

    public disableDraggableMarker(marker :Marker) {
        marker.dragging.disable();
    }

    public enableDraggableMarker(marker :Marker) {
        marker.dragging.enable();
    }

    public addPolyline(map :Map, latlng :LatLng) {
       return L.polyline(latlng, {color: 'red'}).addTo(map);
    }

    public removePolyline(map :Map, polyline :Polyline) {
        map.removeLayer(polyline);
    }
}