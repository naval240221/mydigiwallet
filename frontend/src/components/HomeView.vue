<template>
  <div class="vertical-center">
    <div class="container">
      <div class="col">
        <div class="item-container">
          <div style="font-weight:bold; font-size: x-large; margin-bottom: 50px; text-align: center;">
            MyDigi Wallet
          </div>
          <img alt="My DigiWallet" src="../assets/logo.png" style="height:120px;">
          <br />
          <br />
          <br />
          <p>
            One place of all your digital wallets. Manage all your wallets at one place.<br />
            Load your wallet and spend it at anyehere.
          </p>
          <br />
        </div>
      </div>
      <v-divider vertical></v-divider>
      <div class="col">
        <div class="item-container">
          <NewWallet />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewWallet from '../components/NewWallet.vue'

export default {
  name: 'HomeView',
  components: {
    NewWallet
  },
  mounted () {
    if (window.localStorage.getItem('walletData')) {
      this.$router.push('/wallet/' + JSON.parse(window.localStorage.getItem('walletData')).id)
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style scoped>
.container {
  display: flex;
}

.col {
  margin: 10px;
  width: 50%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-container {
  padding: 5px;
  margin: 5px;
  vertical-align: middle;
}

.vertical-center {
  width: 100%;
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
