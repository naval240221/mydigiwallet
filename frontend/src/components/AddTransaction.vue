<template v-slot:actions>
    <div class="hello" style="width:100%">
      <v-form fast-fail ref="transactionForm" @submit.prevent>
        <v-card class="mx-auto" max-width="400" title="Make a transaction">
          <v-container>
            <v-sheet class="mx-auto">
              <v-text-field v-model="amount" label="Amount" :rules="amoutRules"
                variant="underlined"></v-text-field>
              <v-text-field v-model="description" label="Description for transaction"
                variant="underlined"></v-text-field>
              <v-switch
                v-model="type"
                hide-details
                true-value="CREDIT"
                false-value="DEBIT"
                :label="`Transaction Type: ${type}`"
                ></v-switch>
            </v-sheet>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" class="flex-grow-1" height="48" variant="tonal" @click.prevent="addTransaction">
              New Transaction
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
  import WalletDataService from "../services/walletservice";
  export default {
    name: 'AddTransaction',
    props: {
      walletId: String
    },
    data: () => ({
      snackbar: false,
      snackbartitle: '',
      snackbarmessage: '',
      description: '',
      amount: null,
      amoutRules: [
        value => /^\d+(\.\d+)?$/.test(value) || 'Amount balance can only contain digit and dot',
        value => (value && value.toString().split('.').length < 2) || (value && value.toString().split('.')[1].length <= 4) || 'No more than 4 digits after the decimal point'
      ],
      type: 'CREDIT'
    }),
    methods: {
      async addTransaction() {
        let loader = this.$loading.show({
          container: null,
          loader: 'dots'
        });
        if (!this.amount || isNaN(this.amount)) return alert("Please proivde a wallet name")
        let postData = {
          amount: this.amount,
          type: this.type,
          description: this.description
        };
        setTimeout(() => WalletDataService.createtransaction(this.walletId, postData)
        .then(response => {
          this.snackbartitle = "Transaction is succesfull.";
          this.snackbarmessage = `Updated wallet balance is ${response.data.balance}.`;
          this.snackbar = true;
          const walletData = JSON.parse(window.localStorage.getItem('walletData'));
          walletData.balance = response.data.balance
          localStorage.setItem("walletData", JSON.stringify(walletData));
          this.$refs.transactionForm.reset();
          loader.hide()
        })
        .catch(e => {
          console.log(e);
          this.snackbartitle = "Error Occured";
          this.snackbarmessage = e;
          this.snackbar = true;
          loader.hide()
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
  