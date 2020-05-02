<template>
  <div class="answers">
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>

    <Answer v-model="realAnswer" title="Réponse (vraie)" placeholder="La vraie réponse du jeu"></Answer>

    <Answer
      v-for="answer in answers"
      :showControls="true"
      :disabled="true"
      :key="answer.player.id"
      :title="answer.player.name"
      :value="answer.bluff"
      @edit="edit(answer, $event)"
    ></Answer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import Button from "../../components/Button.vue";
import Answer from "../../components/Answer.vue";
import Player from "../../models/Player";
import Game from "../../models/Game";

interface Bluff {
  player: Player;
  bluff: string;
}

@Component({
  components: {
    Button,
    Answer
  }
})
export default class AnswersMaster extends Vue {
  @Prop() private player!: Player;
  @Prop() private game!: Game;
  private realAnswerValue = "";

  private answers: Array<Bluff> = [
    {
      player: {
        name: 'test',
        id: 'test', 
        game: '',
        score: 0,
      },
      bluff: 'test string'
    }
  ];

  edit(answer: Bluff, bluff: string) {
    this.$socket.client.emit('message', {
      to: answer.player.id,
      message: bluff
    })
  }

  @Socket()
  bluff(b: Bluff) {
    this.answers = this.answers.filter(a => a.player.id != b.player.id);
    this.answers.push(b);
  }

  private get realAnswer() {
    return this.realAnswerValue;
  }

  private set realAnswer(answer: string) {
    this.realAnswerValue = answer;
    this.$emit("data", {
      answer
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
