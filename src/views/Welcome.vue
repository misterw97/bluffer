<template>
  <div class="hello">
    <h1>Bienvenue au Bluffer!</h1>

    <h2>Quel est ton prénom?</h2>
    <input type="text" v-model="name" placeholder="Jean-Pierre" />
    <Button v-if="!join" @click="createNewGame()">Créer un nouveau jeu</Button>
    <Button v-if="!join" @click="joinExistingGame()" >Rejoindre une partie</Button>

    <h2 v-if="join">Quel est le code de la partie?</h2>
    <input v-if="join" type="text" v-model="code" placeholder="123456" />
    <Button v-if="join" @click="joinExistingGame()">Rejoindre</Button>
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

  joinExistingGame() {
    if (this.join) {
      //socker.send join
    } else {
      this.join = true;
    }
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 15vh auto auto;

  .button,
  input, h2 {
    margin-top: 20px;
  }

  .button {
    width: 90%;
    align-self: center;
    font-size: 1.3em;
  }

  input {
    width: 100%;
  }
}

</style>
