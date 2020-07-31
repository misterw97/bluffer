<template>
  <div v-if="!isPartieDisplay" class="answers">
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>

    <Answer
      key="firstAnswer"
      title="Invente une réponse"
      placeholder="Ta réponse doit être crédible pour les autres, paraître être vraie mais ne doit pas être la bonne réponse ! Attention, la vraie réponse est souvent farfelue..."
      v-model="firstAnswer"
      :disabled="sent"
      :showControls="sent && !unsentReview"
      @edit="editAnswer"
    ></Answer>

    <Answer
      v-if="unsentReview"
      v-model="reviewedAnswer"
      title="Le maître du jeu a revu ta réponse, tu peux encore la modifier:"
      placeholder="Le maître du jeu peut revoir une réponse pour la rendre plus crédible, plus ressemblante aux autres ou l'associer à une similaire (peut être la vraie?)."
    ></Answer>

    <Button
      v-show="(!sent)||unsentReview"
      :disabled="sent?(reviewedAnswer.length<1):(firstAnswer.length<1)"
      @click="sendAnswer()"
    >Envoyer</Button>
  </div>
  <div v-else>
    <h1>{{game.data.question}}</h1>
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
    Answer,
  },
})
export default class AnswersPlayer extends Vue {
  @Prop() private player!: Player;
  @Prop() private game!: Game;
  private firstAnswer: string = "";
  private reviewedAnswer: string = "";
  private sent: boolean = false;
  private unsentReview: boolean = false;

  get isPartieDisplay() {
    return this.player.name === "Partie";
  }

  @Socket()
  bluff({ bluff, hash }: { bluff: string; hash: string }) {
    this.unsentReview = true;
    this.reviewedAnswer = bluff;
    this.$emit("data", {
      answer: bluff,
      answerHash: hash,
    });
  }

  editAnswer(bluff: string) {
    this.sendBluff(bluff, false);
  }

  sendAnswer() {
    const bluff = this.sent ? this.reviewedAnswer : this.firstAnswer;
    this.sendBluff(bluff, this.sent);
  }

  sendBluff(bluff: string, review = false) {
    this.$socket.client.emit("bluff", bluff, (hash: string) => {
      this.$emit("data", {
        answer: bluff,
        answerHash: hash,
      });
      if (review) {
        this.firstAnswer = this.reviewedAnswer;
        this.reviewedAnswer = "";
        this.unsentReview = false;
      }
      this.sent = true;
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
