<template>
  <div class="question">
    <Ink class="logo" />
    <h2>Sois patient, le maitre du jeu écrit la question pour le tour #{{game.count + 1}}...</h2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "../../models/Game";
import Ink from "../../assets/ink.svg";

@Component({
  components: {
    Ink
  }
})
export default class extends Vue {
  @Prop() private game!: Game;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.question {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  flex-direction: column;

  .logo {
    margin-bottom: 30px;
  }

  h2 {
    text-align: center;
  }

  @include sm {
    padding: 90px 0;
    flex-direction: row;

    .logo {
      margin: 0 10px 0 0;
    }

    h2 {
      max-width: 300px;
    }
  }
}
</style>
