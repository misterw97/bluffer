<template>
  <div class="answers">    
    <Answer
      :disabled="true"
      :value="game.data.question"
      title="Question"
    ></Answer>

    <Answer
      v-model="realAnswer"
      title="Réponse (vraie)"
      placeholder="La vraie réponse du jeu"
    ></Answer>
    
    <Answer
      v-for="answer in answers"
      :disabled="true"
      :key="answer.player.id"
      :title="answer.player.name"
      :value="answer.answer"
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

interface IAnswer { player: Player; answer: string }

@Component({
  components: {
    Button,
    Answer
  }
})
export default class extends Vue {
  @Prop() private player!: Player;
  @Prop() private game!: Game;
  private realAnswerValue = "";

  private answers: Array<IAnswer> = [
    {
        player: {
          id: '123456abc',
          name: 'Isabelle',
          game: '',
          score: 0,
        },
        answer: 'La réponse de Isabelle'
      },
      {
        player: {
          id: '123edaf',
          name: 'Roger',
          game: '',
          score: 0,
        },
        answer: 'La réponse de Roger'
      }
  ];

  @Socket()
  message(data: IAnswer) {
    console.log(data);
    this.answers.push(data);
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
