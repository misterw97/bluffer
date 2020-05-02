<template>
  <div v-if="!!player" class="game">
    <h1>Jeu #{{ player.game }}</h1>
    <h2>{{ player.name }}: {{ player.isMaster }}</h2>
    <div v-if="(!game)||(game.state=='w')">
      waiting animation... {{ game }}// TODO
    </div>
    <component v-else v-bind:is="gameView"
      :player="player"
      :game="game" >
    </component>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from 'vue-socket.io-extended'
import QuestionMaster from "./QuestionMaster.vue";
import AnswersMaster from "./AnswersMaster.vue";
import Button from "../components/Button.vue";
import Player from "../models/Player";
import Game from "../models/Game";
import GameState from '../models/GameState';

@Component({
  components: {
    Button
  }
})
export default class extends Vue {
  private player: Player|null = null;
  private game: Game|null = null;
  private gameView: null|
    typeof QuestionMaster|
    typeof AnswersMaster = null;

  @Socket()
  state(data: any) {
    this.game = data as Game;
    // TODO move /views/master/QuestionMaster.vue
    // TODO move /views/player/QuestionPlayer.vue
    switch (this.game.state) {
      case GameState.question:
        this.gameView = QuestionMaster;
        break;
      case GameState.answers:
        this.gameView = AnswersMaster;
    }
  }

  mounted() {
    const gameId = this.$route.params.game;
    const playerId = this.$route.params.player;
    this.$socket.client.emit(
      "join",
      {
        id: playerId,
        game: gameId
      },
      (player: Player) => (this.player = player)
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
