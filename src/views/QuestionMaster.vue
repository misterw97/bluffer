<template>
  <div class="question">
    <Answer v-model="question" title="Question" placeholder="Question originale"></Answer>
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
  private questionValue: string = "";

  private get question() {
    return this.questionValue;
  }

  private set question(question: string) {
    this.questionValue = question;
    this.$emit("data", {
      question
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
