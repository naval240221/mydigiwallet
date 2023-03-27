<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark">
      <img alt="My DigiWallet" src="./assets/logo.png" style="height:40px;width: 40px;margin-left: 30px;">
      <div class="navbar-nav mr-auto" style="margin-left: 50px;">
        <li class="nav-item" style="font-weight: bold;">
          MyDigi Wallet
        </li>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "app"
  };
</script>