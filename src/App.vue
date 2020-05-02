<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;

  h1 {
    font-size: 2.7em;
    color: $primary;
  }

  h2 {
    margin: 0;
    font-weight: normal;
    font-size: 1.3em;
  }

  input,
  textarea {
    margin-bottom: 10px;
    padding: 10px;
    border: 3px solid $secondary;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.3em;
    outline: none;
    box-sizing: border-box;

    &:disabled {
      background: $grey;
      border-color: $darkgrey;
    }
  }

  #fab {
    width: 300px;
    float: right;
    position: relative;
    height: 50px;
    right: 0;
    top: -70px;
  }
}
body {
  background: $grey;
}
</style>
