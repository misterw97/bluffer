<template>
  <div class="votes">
    <Timer class="timer" :seconds="30" />
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>

    <h2>
      Devine la bonne réponse !
      <small>(Tu ne peux pas voter pour la tienne)</small>
    </h2>
    <AnswerGroup @vote="vote" :responses="responses" :votes="votes" :player="player" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Answer from "../../components/Answer.vue";
import Timer from "../../components/Timer.vue";
import AnswerGroup from "../../components/AnswerGroup.vue";
import Game from "../../models/Game";
import Player from "../../models/Player";
import Vote from "../../models/Vote";
import GameAnswer from "../../models/GameAnswer";

@Component({
  components: {
    Answer,
    AnswerGroup,
    Timer
  }
})
export default class extends Vue {
  @Prop() private game!: Game;
  @Prop() private player!: Player;

  private responses: Array<GameAnswer> = [];

  mounted() {
    if (this.player.voteId)
      this.votes = [{ voteId: this.player.voteId, player: this.player }];

    this.responses = this.game.data.answers!.map(
      ({ hash, value }: { hash: string; value: string }) => {
        return {
          hash,
          value,
          disabled: hash === this.player.answerId || !!this.player.isMaster
        };
      }
    );
  }

  votes: Vote[] = [];

  vote(response: GameAnswer) {
    this.$emit("data", { voteId: response.hash });
    this.$socket.client.emit("vote", response.hash, (data: string) => {
      if (data == "OK: " + response.hash)
        this.votes = [{ voteId: response.hash, player: this.player }];
      else this.votes = [];
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.votes {
  .timer {
    position: absolute;
    right: $padding;
    color: $primary;
    font-weight: bold;
    font-size: 1.5em;
  }
}
</style>
