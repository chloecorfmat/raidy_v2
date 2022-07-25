import type { LatLng } from "leaflet";
import { defineStore } from "pinia";
import LeafletService from "../services/LeafletService";

export const useTracksStore = defineStore({
  id: "tracks",
  state: () => ({
    data: [],
    lastId: 0,
    trackEditing: {}
  }),
  getters: {
    getData: (state) => state.data,
    getLastId: (state) => state.lastId,
    getTrackEditing: (state) => state.trackEditing,
  },
  actions: {
    setTrackEditing (track :any) {
        let object = Object.assign({}, track);
        object.id = this.lastId;
        this.lastId++;
        this.data.push(object);
        this.trackEditing = object;
    },
    resetTrackEditing () {
        this.trackEditing = {}
    },
    deleteTrack(id :number) {
      let trackIndex = this.data.findIndex(track => track.id == id);
      this.data.splice(trackIndex, 1);

      if (this.trackEditing.id == id) {
        this.trackEditing = {};
      }
    }
  },
});