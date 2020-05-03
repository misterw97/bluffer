<template>
  <main>
    <div v-if="!!player&&!!game" class="game">
      <div class="row">
        <div class="col">
          <h1 v-if="player.isMaster">Jeu <a :href="`#/?code=${player.game}`">#{{ player.game }}</a></h1>
          <h1 v-else>{{ player.name }}</h1>

          <h2 v-if="player.isMaster">{{ player.name }} (Maître de jeu)</h2>
          <h2 v-else>Bluffer #{{ player.game }}</h2>
        </div>
        <GameStateDisplay :state="game.state" />
      </div>

      <div class="header">
        <h3 v-if="!!game">Tour #{{game.count+1}}</h3>
        <Button v-if="player.isMaster && action!=''" id="fab" @click="sendData()">{{ action }}</Button>
      </div>

      <component v-bind:is="gameView" :player="player" :game="game" @data="updateData"></component>
    </div>
    <PlayerList class="player-list" v-show="!!player" :player="player" />

    <div v-if="!player || !game" id="game-loader" class="loader">
      <lottie-player
        :src="`${publicPath}load-bar.json`"
        background="transparent"
        speed="1"
        style="width: 300px; height: 300px;"
        loop
        autoplay
      ></lottie-player>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import QuestionPlayer from "./player/QuestionPlayer.vue";
import AnswersPlayer from "./player/AnswersPlayer.vue";
import VotesPlayer from "./player/VotesPlayer.vue";
import ResultsPlayer from "./player/ResultsPlayer.vue";
import QuestionMaster from "./master/QuestionMaster.vue";
import AnswersMaster from "./master/AnswersMaster.vue";
import PlayerList from "../components/PlayerList.vue";
import GameStateDisplay from "../components/GameStateDisplay.vue";
import Button from "../components/Button.vue";
import Player from "../models/Player";
import Game from "../models/Game";
import GameState from "../models/GameState";

type GameViewType =
  | typeof QuestionMaster
  | typeof AnswersMaster
  | typeof QuestionPlayer
  | typeof AnswersPlayer
  | typeof VotesPlayer
  | typeof ResultsPlayer;

@Component({
  components: {
    Button,
    PlayerList,
    GameStateDisplay
  }
})
export default class GameView extends Vue {
  private player: Player | null = null;
  private game: Game | null = null;
  private gameView: GameViewType | null = null;
  private action: string = "";
  private data?: any = {};
  private publicPath = process.env.BASE_URL;

  @Socket()
  state(data: any) {
    this.game = data as Game;
    switch (this.game.state) {
      case GameState.question:
        this.action = "Ouvrir les réponses";
        this.gameView = this.player?.isMaster ? QuestionMaster : QuestionPlayer;
        break;
      case GameState.answers:
        this.action = "Ouvrir le vote";
        this.gameView = !!this.player?.isMaster ? AnswersMaster : AnswersPlayer;
        break;
      case GameState.votes:
        this.action = "Fermer le vote";
        if (!!this.data.answerHash)
          this.player!.answerId = this.data.answerHash;
        this.gameView = VotesPlayer;
        break;
      case GameState.results:
        this.action = "Nouvelle question";
        if (!!this.data.voteId) this.player!.voteId = this.data.voteId;
        this.gameView = ResultsPlayer;
        break;
    }
  }

  private join() {
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

  mounted() {
    this.join();
  }

  @Socket()
  reconnect() {
    this.join();
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
    position: relative;
    flex: 3;
    padding: $padding;
    text-align: left;
    display: flex;
    flex-direction: column;

    .row {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    h1 {
      margin-bottom: 0;

      a {
        color: $primary;
        text-decoration: none;
      }
    }

    h3 {
      margin-top: 40px;
      margin-bottom: 30px;
    }
  }

  .player-list {
    display: none;
    flex: 1;

    @include md {
      display: unset;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #game-loader {
    z-index: 1;
    background: white;
  }

  #fab {
    width: 300px;
    // float: right;
    position: relative;
    height: 50px;
  }
}
</style>
