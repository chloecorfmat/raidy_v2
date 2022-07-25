import type { LatLng } from "leaflet";
import { defineStore } from "pinia";
import LeafletService from "../services/LeafletService";

export const usePoisStore = defineStore({
  id: "pois",
  state: () => ({
    data: [],
    lastId: 0
  }),
  getters: {
    getData: (state) => state.data,
    getLastId: (state) => state.lastId,
  },
  actions: {
    addPoi(newPoi :any) {
        let object = Object.assign({}, newPoi);
        object.id = this.lastId;
        this.lastId++;
        this.data.push(object);
    },
    updatePoi(updatedPoi :any, id :number) {
      let poi = this.data.find(poi => poi.id == id);
      poi.name = updatedPoi.name;
      poi.requiredHelpers = updatedPoi.requiredHelpers;
    },
    movePoi(leaflet_id :number, latlng :LatLng) {
      let poi = this.data.find(poi => poi.marker._leaflet_id == leaflet_id);
      poi.lat = latlng.lat;
      poi.lng = latlng.lng;
    },
    deletePoi(id :number) {
      let poiIndex = this.data.findIndex(poi => poi.id == id);
      this.data.splice(poiIndex, 1);
      
    },
    disableDraggableMarkers() {
      const leafletService = new LeafletService();
      this.data.forEach(poi => {
        leafletService.disableDraggableMarker(poi.marker);
      })
    },
    enableDraggableMarkers() {
      const leafletService = new LeafletService();
      this.data.forEach(poi => {
        leafletService.enableDraggableMarker(poi.marker);
      })
    }
  },
});
