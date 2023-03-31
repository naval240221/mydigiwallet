<template v-slot:actions>
  <div class="hello" style="width:100%">
    <v-form fast-fail @submit.prevent>
      <v-card class="mx-auto" max-width="400" title="Setup Wallet">
        <v-container>
          <v-sheet class="mx-auto">
            <v-text-field v-model="name" label="User Name" :rules="walletNameRules"
              variant="underlined"></v-text-field>

            <v-text-field v-model="balance" label="Balance Amount" :rules="balanceAmoutRules"
              variant="underlined"></v-text-field>
          </v-sheet>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" class="flex-grow-1" height="48" variant="tonal" @click.prevent="setupWallet">
            Setup Wallet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
  <div style="margin-top:20px;">
    <v-snackbar
      :timeout="2000"
      :color="snackbarcolor"
      variant="tonal"
      v-model="snackbar"
      vertical
    >
      <div class="text-subtitle-1 pb-2">{{ snackbartitle }}</div>
      <p>{{ snackbarmessage  }}</p>
      <template v-slot:actions>
        <v-btn
          :color="snackbarcolor"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// import axios from "axios";
import WalletDataService from "../services/walletservice";

export default {
  name: 'NewWallet',
  data: () => ({
    snackbar: false,
    snackbartitle: '',
    snackbarmessage: '',
    snackbarcolor: 'success',
    name: '',
    walletNameRules: [
      value => !!value || "Wallet name is required",
      value => value?.length >= 8 || 'Wallet name must be atleast 8 characters.',
      value => /[0-9a-zA-Z]$/.test(value) || 'Wallet name can not contain special charcters.'
    ],
    balance: null,
    balanceAmoutRules: [
      value => /^\d+(\.\d+)?$/.test(value) || 'Wallet balance can only contain digit and dot',
      value => (value && value.toString().split('.').length < 2) || (value && value.toString().split('.')[1].length <= 4) || 'No more than 4 digits after the decimal point'
    ],
  }),
  methods: {
    async setupWallet() {
      let loader = this.$loading.show({
        container: null,
        loader: 'dots'
      });
      if (!this.name) return alert("Please proivde a wallet name")
      let postData = {
        name: this.name
      };
      if (this.balance) {
        postData.balance = this.balance
      }
      setTimeout(() => WalletDataService.create(postData)
        .then(response => {
          loader.hide()
          localStorage.setItem("walletData", JSON.stringify(response.data));
          this.snackbartitle = "New wallet seup is succesfull.";
          this.snackbarmessage = "A new wallet " + response.data.name + " has been created succesfully.";
          this.snackbarcolor = 'success';
          this.snackbar = true;
          this.$router.push({ name: 'wallet', params: { id: response.data.id } })
        })
        .catch(e => {
          loader.hide()
          let errorMessage = e;
          if (e.request && e.request.response) {
            try {
              let errorData = JSON.parse(e.request.response);
              errorMessage = errorData.error
            } catch (error) {
              errorMessage = e.request.response
            }
          }
          this.snackbartitle = "Error Occured";
          this.snackbarmessage = errorMessage;
          this.snackbarcolor = 'red';
          this.snackbar = true;
        }), 2000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
