<template>
  <div class="hello">
    <h1>Bienvenue au Bluffer!</h1>

    <p>Quel est ton prénom?</p>
    <input type="text" v-model="name" placeholder="Jean-Pierre" />
    <Button v-if="!join" @click="createNewGame()">Créer un nouveau jeu</Button>
    <Button v-if="!join">Rejoindre une partie</Button>

    <p v-if="join">Quel est le code de la partie?</p>
    <input v-if="join" type="text" v-model="code" placeholder="123456" />
    <Button v-if="join">Rejoindre</Button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "../components/Button.vue";
import { Socket } from "vue-socket.io-extended";

@Component({
  components: {
    Button
  }
})
export default class Welcome extends Vue {
  private join = false;
  private name = "";

  @Socket() // --> listens to the event by method name, e.g. `connect`
  connect() {
    console.log("connection established");
  }

  createNewGame() {
    this.$socket.client.emit(
      "join",
      {
        name: this.name
      },
      (data: any) => {
        this.$router.push({
          name: "Game",
          params: {
            player: data.id,
            game: data.game
          }
        });
      }
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.hello {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: auto;
  display: flex;

  h1 {
    font-size: 2.7em;
    color: $primary;
  }

  p {
    margin: 0;
    font-size: 1.3em;
  }

  .button,
  input, p {
    margin-top: 20px;
  }

  .button {
    width: 90%;
    align-self: flex-end;
    font-size: 1.3em;
  }

  input {
    width: 100%;
  }
}
input {
  margin-bottom: 10px;
  padding: 10px;
  border: 3px solid $secondary;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1.3em;
  outline: none;
}
</style>
