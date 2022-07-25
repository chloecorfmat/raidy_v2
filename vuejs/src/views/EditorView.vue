<template>
  <div class="editor">
    <Panel />
    <Map />
    <PoiPopin v-if="this.editorStore.popin.name == 'poi'"/>
    <PoiDeletePopin v-if="this.editorStore.popin.name == 'poiDelete'"/>
    <TrackPopin v-if="this.editorStore.popin.name == 'track'" />
    <TrackDeletePopin v-if="this.editorStore.popin.name == 'trackDelete'" />
  </div>
</template>

<style>
  .editor {
    display: flex;
    flex-direction: row;
  }
</style>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Map from '../components/editor/Map.vue';
  import Panel from '../components/editor/Panel.vue';
  import PoiPopin from '../components/editor/PoiPopin.vue';
  import PoiDeletePopin from '../components/editor/PoiDeletePopin.vue';
  import TrackPopin from '../components/editor/TrackPopin.vue';
  import TrackDeletePopin from '../components/editor/TrackDeletePopin.vue';
  import { useEditorStore } from '../stores/editorStore';

  export default defineComponent({
    components: {
      PoiPopin,
      PoiDeletePopin,
      Map,
      Panel,
      TrackPopin,
      TrackDeletePopin
    },
    setup () {
      const editorStore = useEditorStore();
      return { editorStore }
    },
    computed : {
      
    }
  })
  
</script>
