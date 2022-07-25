import type { Map, Polyline } from "leaflet";
import { defineStore } from "pinia";

import { usePoisStore } from './poisStore';
import { EDITOR_MODES } from '../utils/constants.js';

export const useEditorStore = defineStore({
  id: "editor",
  state: () => ({
    mode: 'reading',
    map: {},
    popin: {},
  }),
  getters: {
    getMode: (state) => state.mode,
    getMap: (state) => state.map,
    getPopin: (state) => state.popin,
  },
  actions: {
    setMode(mode: string) {
      this.mode = mode;
      const poisStore = usePoisStore();
      
      switch(mode) {
        case EDITOR_MODES.ADDING_POI:
          // Disabling draggable for markers.
          poisStore.disableDraggableMarkers();
          break;
        case EDITOR_MODES.READING: 
          poisStore.enableDraggableMarkers();
          break;
        case EDITOR_MODES.LOCKED:
          // Disabling draggable for markers on locked mode.
          poisStore.disableDraggableMarkers();
          break;
        default:
          break;
      }

    },
    setMap(map: Map) {
      this.map = map;
    },
    setPopin(name: String, data: object) {
      this.popin.name = name;
      this.popin.data = data;
    }
  },
});
