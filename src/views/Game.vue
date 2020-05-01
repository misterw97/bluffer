<template>
  <div v-if="!!player" class="game">
    <h1>Game: {{ player.room }}</h1>
    <h2>{{player.name}}</h2>
    <!-- TODO: question/answers/votes -->
    <!-- TODO: Leader board -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "../components/Button.vue";
import Player from "../models/Player";

@Component({
  components: {
    Button
  }
})
export default class Game extends Vue {
  private player: Player|null = null;

  mounted() {
    const roomId = this.$route.params.game;
    const playerId = this.$route.params.player;
    this.$socket.client.emit(
      "join",
      {
        id: playerId,
        room: roomId
      },
      (player: Player) => (this.player = player)
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
