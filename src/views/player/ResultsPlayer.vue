<template>
  <div class="results">
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>
    <AnswerGroup :responses="responses" :votes="votes" :disabled="true" :player="player" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Answer from "../../components/Answer.vue";
import AnswerGroup from "../../components/AnswerGroup.vue";
import Game from "../../models/Game";
import Player from "../../models/Player";
import Vote from "../../models/Vote";
import GameAnswer from "../../models/GameAnswer";

@Component({
  components: {
    Answer,
    AnswerGroup
  }
})
export default class extends Vue {
  @Prop() private game!: Game;
  @Prop() private player!: Player;

  private responses: Array<GameAnswer> = [];
  private votes: Vote[] = [];

  mounted() {
    console.log(this.game.data.answers);

    this.responses = this.game!.data.answers!.map(
      ({ hash, value, good, authors, votes }: GameAnswer) => {
        if (!!votes)
          votes.forEach(vote =>
            this.votes.push({ voteId: vote.voteId!, player: vote })
          );
        return {
          hash,
          value,
          good,
          votes,
          disabled: hash == this.player.answerId || !!this.player.isMaster
        };
      }
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
