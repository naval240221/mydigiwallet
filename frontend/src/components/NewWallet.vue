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
          <v-btn type="submit" class="flex-grow-1" height="48" variant="tonal" @click="setupWallet">
            Setup Wallet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
  <div style="margin-top:20px;">
    <v-snackbar
      :timeout="2000"
      color="primary"
      variant="tonal"
      v-model="snackbar"
      vertical
    >
      <div class="text-subtitle-1 pb-2">{{ snackbartitle }}</div>
      <p>{{ snackbarmessage  }}</p>
      <template v-slot:actions>
        <v-btn
          color="indigo"
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
    async setupWallet(e) {
      e.preventDefault();
      if (!this.name) return alert("Please proivde a wallet name")
      let postData = {
        name: this.name
      };
      if (this.balance) {
        postData.balance = this.balance
      }
      WalletDataService.create(postData)
        .then(response => {
          localStorage.setItem("walletData", JSON.stringify(response.data));
          this.snackbartitle = "New wallet seup is succesfull.";
          this.snackbarmessage = "A new wallet " + response.data.name + " has been created succesfully.";
          this.snackbar = true;
          this.$router.push({ name: 'wallet', params: { id: response.data.id } })
        })
        .catch(e => {
          console.log(e);
          this.snackbartitle = "Error Occured";
          this.snackbarmessage = e;
          this.snackbar = true;
        });
      // try {
      //   const response = await axios.post('/setup', postData);
      //   localStorage.setItem("walletData", JSON.stringify(response.data));
      //   this.snackbartitle = "New wallet seup is succesfull.";
      //   this.snackbarmessage = "A new wallet " + response.data.name + " has been created succesfully.";
      //   this.snackbar = true;
      //   this.$router.push({ name: 'wallet', params: { id: response.data.id } })
      // } catch (error) {
      //   let errorMessage = "";
      //   if (error.response) {
      //     if (error.response.data && error.response.data.message) {
      //       if (/duplicate/.test(error.response.data.message)) {
      //         errorMessage = "A wallet is already exists with the same name";
      //       } else {
      //         errorMessage = error.response.data.message;
      //       }
      //     } else {
      //       errorMessage = error.response.data;
      //     }
      //   } else if (error.request) {
      //     errorMessage = error.request;
      //   } else {
      //     errorMessage = error.message;
      //   }
      //   this.snackbartitle = "Error Occured";
      //   this.snackbarmessage = errorMessage;
      //   this.snackbar = true;
      // }
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
