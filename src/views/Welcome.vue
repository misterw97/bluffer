<template>
  <div class="hello">
    <h1 id="main">Bienvenue au Bluffer!</h1>

    <h2>Quel est ton prénom?</h2>
    <input type="text" v-model="name" placeholder="Jean-Pierre" />
    <Button v-if="!join" :disabled="!nameIsValid" @click="createNewGame()">Créer un nouveau jeu</Button>
    <Button v-if="!join" @click="joinExistingGame()">Rejoindre une partie</Button>

    <h2 v-if="join">Quel est le code de la partie?</h2>
    <input v-if="join" type="text" v-model="code" placeholder="123456" />
    <Button v-if="join" :disabled="!codeIsValid" @click="joinExistingGame()">Rejoindre</Button>
    <Button v-if="join" @click="join=false">Annuler</Button>
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
  private code = "";

  @Socket() // --> listens to the event by method name, e.g. `connect`
  connect() {
    console.log("connection established");
  }

  mounted() {
    if (!!this.$route.query.code) {
      this.code = this.$route.query.code as string;
      this.join = true;
    }
  }

  get codeIsValid() {
    return /^[0-9]{6}$/.test(this.code);
  }

  get nameIsValid() {
    return this.name.trim().length > 1;
  }

  joinExistingGame() {
    if (this.join) {
      if (!this.codeIsValid)
        return alert("Le code de partie doit avoir 6 chiffres.");
      if (!this.nameIsValid)
        return alert("Le prénom doit avoir au moins 2 caractères.");
      this.joinGame({ name: this.name.trim(), game: this.code });
    } else {
      this.join = true;
    }
  }

  createNewGame() {
    this.joinGame({ name: this.name });
  }

  joinGame(value: any) {
    this.$socket.client.emit("join", value, (data: any) => {
      this.$router
        .push({
          name: "Game",
          params: {
            player: data.id,
            game: data.game
          }
        })
        .catch(e =>
          alert("Impossible de rejoindre ce jeu. Est-ce le bon code ?")
        );
    });
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
  padding: 30px;
  text-align: left;

  h1#main {
    margin-bottom: 20px;
  }

  .button,
  input,
  h2 {
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
