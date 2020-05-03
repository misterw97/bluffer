<template>
  <div id="app">
    <div v-show="!connected" class="loader">
      <lottie-player
        src="https://assets7.lottiefiles.com/packages/lf20_1uKnRo.json"
        background="transparent"
        speed="1"
        style="width: 300px; height: 300px;"
        loop
        autoplay
      ></lottie-player>
      <!-- TODO: inclure conseils comme refresh page -->
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";

@Component
export default class App extends Vue {
  private connected: boolean = false;

  @Socket()
  connect() {
    console.log("connection established");
    this.connected = true;
  }

  @Socket()
  disconnect() {
    console.log("disconnected");
    this.connected = false;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;

  h1 {
    margin: 0;
    font-size: 2.7em;
    color: $primary;
  }

  h2 {
    margin: 0;
    font-weight: normal;
    font-size: 1.3em;
  }

  input,
  textarea {
    margin-bottom: 10px;
    padding: 10px;
    @include border;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.3em;
    outline: none;
    box-sizing: border-box;

    &:disabled {
      background: $grey;
      border-color: $darkgrey;
    }
  }

  div.loader {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
  }
}
body {
  background: $grey;
}
</style>
