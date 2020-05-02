<template>
  <div class="answers">
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>

    <Answer
      :disabled="sent"
      key="firstAnswer"
      v-model="firstAnswer"
      title="Invente une réponse"
      placeholder="Ta réponse doit être crédible pour les autres, paraître être vraie mais ne doit pas être la bonne réponse ! Attention, la vraie réponse est souvent farfelue..."
    ></Answer>

    <Answer
      v-if="unsentReview"
      v-model="reviewedAnswer"
      title="Le maître du jeu a revu ta réponse, tu peux encore la modifier:"
      placeholder="Le maître du jeu peut revoir une réponse pour la rendre plus crédible, plus ressemblante aux autres ou l'associer à une similaire (peut être la vraie?)."
    ></Answer>

    <Button v-show="(!sent)||unsentReview" @click="sendAnswer()">Envoyer</Button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import Button from "../../components/Button.vue";
import Answer from "../../components/Answer.vue";
import Player from "../../models/Player";
import Game from "../../models/Game";

interface IAnswer {
  player: Player;
  answer: string;
}

@Component({
  components: {
    Button,
    Answer
  }
})
export default class AnswersPlayer extends Vue {
  @Prop() private player!: Player;
  @Prop() private game!: Game;
  private firstAnswer: string = "";
  private reviewedAnswer: string = "";
  private sent: boolean = false;
  private unsentReview: boolean = false;

  @Socket()
  bluff(data: any) {
    this.unsentReview = true;
    this.reviewedAnswer = data;
  }

  sendAnswer() {
    const bluff = this.sent ? this.reviewedAnswer : this.firstAnswer;
    this.$socket.client.emit("bluff", bluff);
    if (this.sent) {
      this.firstAnswer = this.reviewedAnswer;
      this.reviewedAnswer = "";
      this.unsentReview = false;
    } else {
      // TODO: check callback and md5 hash to mark as sent
      this.sent = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
