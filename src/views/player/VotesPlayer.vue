<template>
  <div class="votes">
    <h2>Question</h2>
    <textarea name id cols="30" rows="3"></textarea>

    <h2>
      Devine la bonne réponse !
      <small>(Tu ne peux pas voter pour la tienne)</small>
    </h2>
    <div class="responses">
      <Button @click="vote(response)" class="response" :disabled="response.disabled" v-for="response in responses" :key="response.id">{{response.title}}</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "../../components/Button.vue";
import Game from "../../models/Game";

@Component({
  components: {
    Button
  }
})
export default class extends Vue {
  @Prop() private game!: Game;

  private _voted?: number;

  responses = [
    { id: 1, title: "Réponse 1, credible mais bon, on a quand même un doute" },
    { id: 2, title: "Réponse 2, la mienne", disabled: true, },
    { id: 3, title: "Réponse 3, la vraie" }
  ];

  vote(data: any) {
    console.log(data);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$margin: 10px;

.votes {
  .responses {
    display: flex;
    flex-wrap: wrap;

    .response {
      width: calc(50% - #{2 * $margin});
      margin: $margin;
      font-size: 1.17em;
    }
  }
}
</style>
