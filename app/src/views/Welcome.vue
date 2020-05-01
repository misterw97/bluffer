<template>
  <div class="hello">
    <h1>Bienvenue au Bluffer!</h1>
    <h2>Quel est ton prénom?</h2>
    <input type="text" v-model="name" placeholder="Jean-Pierre" />
    <Button>Créer un nouveau jeu</Button>
    <Button>Rejoindre une partie</Button>
    <h2>Quel est le code de la partie?</h2>
    <input type="text" v-model="code" placeholder="123456" />
    <Button>Rejoindre</Button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "../components/Button.vue";

@Component({
  components: {
    Button
  }
})
export default class Welcome extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1 {
  color: $primary;
}
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
input {
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid orange;
  border-radius: 5px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1em;
}
</style>
