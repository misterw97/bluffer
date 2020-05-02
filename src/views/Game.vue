<template>
  <main>
    <div v-if="!!player" class="game">
      <h1>Jeu #{{ player.game }}</h1>
      <h2>{{ player.name }}: {{ player.isMaster }}</h2>
      <h3 v-if="!!game">Tour #{{game.count+1}}</h3>
      <div v-if="(!game)||(game.state=='w')">waiting animation... {{ game }}// TODO</div>
      <component v-else v-bind:is="gameView" :player="player" :game="game" @data="nextStep"></component>
    </div>
    <PlayerList v-show="!!player" :player="player" />
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import QuestionMaster from "./QuestionMaster.vue";
import AnswersMaster from "./AnswersMaster.vue";
import PlayerList from "../components/PlayerList.vue";
import Button from "../components/Button.vue";
import Player from "../models/Player";
import Game from "../models/Game";
import GameState from "../models/GameState";

@Component({
  components: {
    Button,
    PlayerList
  }
})
export default class extends Vue {
  private player: Player | null = null;
  private game: Game | null = null;
  private gameView: null | typeof QuestionMaster | typeof AnswersMaster = null;

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

  nextStep(data: any) {
    this.$socket.client.emit("data", data);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
main {
  display: flex;
  width: 100%;

  .game {
    flex: 1;
    padding: 30px;
    text-align: left;

    h1 {
      margin-bottom: 0;
    }

    h3 {
      margin-top: 40px;
      margin-bottom: 30px;
    }
  }
}
</style>
