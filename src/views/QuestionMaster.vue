<template>
  <div class="question">
    <Button id="fab" @click="sendQuestion()">Ouvrir les réponses</Button>
    <Answer
      v-model="question"
      title="Question"
      placeholder="Question originale"
    ></Answer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import Button from "../components/Button.vue";
import Answer from "../components/Answer.vue";
import Player from "../models/Player";
import Game from "../models/Game";

@Component({
  components: {
    Button,
    Answer
  }
})
export default class extends Vue {
  @Prop() private player!: Player;
  @Prop() private game!: Game;
  private question: string = "";

  sendQuestion() {
      this.$emit('data', {
          question: this.question
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
