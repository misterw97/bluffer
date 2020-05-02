<template>
  <main>
    <GameStateDisplay />
    <div v-if="!!player" class="game">
      <h1>Jeu #{{ player.game }}</h1>
      <h2>{{ player.name }}: {{ player.isMaster }}</h2>

      <div class="header">
        <h3 v-if="!!game">Tour #{{game.count+1}}</h3>
        <Button v-if="action!=''" id="fab" @click="sendData()">{{ action }}</Button>
      </div>

      <div v-if="(!game)||(game.state=='w')">waiting animation... {{ game }}// TODO</div>
      <component v-else v-bind:is="gameView" :player="player" :game="game" @data="updateData"></component>
    </div>
    <PlayerList v-show="!!player" :player="player" />
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import QuestionMaster from "./master/QuestionMaster.vue";
import AnswersMaster from "./master/AnswersMaster.vue";
import PlayerList from "../components/PlayerList.vue";
import GameStateDisplay from "../components/GameStateDisplay.vue";
import Button from "../components/Button.vue";
import Player from "../models/Player";
import Game from "../models/Game";
import GameState from "../models/GameState";

@Component({
  components: {
    Button,
    PlayerList,
    GameStateDisplay
  }
})
export default class extends Vue {
  private player: Player | null = null;
  private game: Game | null = null;
  private gameView: null | typeof QuestionMaster | typeof AnswersMaster = null;
  private action: string = '';
  private data?: any;

  @Socket()
  state(data: any) {
    this.game = data as Game;
    // TODO move /views/master/QuestionMaster.vue
    // TODO move /views/player/QuestionPlayer.vue
    switch (this.game.state) {
      case GameState.question:
        this.action = "Ouvrir les réponses";
        this.gameView = QuestionMaster;
        break;
      case GameState.answers:
        this.action = "Ouvrir le vote";
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

  sendData() {
    this.$socket.client.emit("data", this.data);
    this.data = {};
  }

  private updateData(data: any) {
    this.data = data;
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

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
