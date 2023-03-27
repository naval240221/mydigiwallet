<template>
  <div class="vertical-center">
    <div class="container">
      <div class="col">
        <div class="item-container">
          <div style="font-weight:bold; font-size: x-large; margin-bottom: 50px; text-align: center;">
            Wallet Details
          </div>
          <div style="text-align: left;margin-left: 80px;">
            <v-container>
              <v-row>
                <v-col>
                  <span :title="walletDetails.name">
                    Name: {{ walletDetails.name }}
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span :title="walletDetails.balance">
                    Balance: {{ walletDetails.balance }}
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <span :title="formatDate(walletDetails.createdAt)">
                    Wallet Created At: {{ formatDate(walletDetails.createdAt) }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <br />
          <v-btn variant="text" color="deep-purple-accent-4" @click="getTransaction">
            See All Transactions
          </v-btn>
        </div>
      </div>
      <v-divider vertical></v-divider>
      <div class="col">
        <div class="item-container">
          <AddTransaction :walletId="walletDetails.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddTransaction from '@/components/AddTransaction.vue';
import moment from 'moment';
import WalletDataService from "../services/walletservice";

export default {
    name: "walletView",
    // props: {
    //   walletDetails: Object
    // },
    components: { AddTransaction },
    data: () => ({
      walletDetails: {},
      lastChange: null,
      timer: null
    }),
    methods: {
      async fetchData() {
        let walletId = this.$route.params.id
        WalletDataService.get(walletId)
          .then(response => {
            this.walletDetails = response.data;
          }).catch(e => {
            console.log(e);
          }).finally(() => console.log('Call Done'));
      },
      formatDate(value) {
        return moment(value).format("MMMM Do YYYY, h:mm:ss a");
      },
      getTransaction(e) {
        e.preventDefault();
        this.$router.push({ name: 'transactions', query: { walletId: this.$route.params.id, skip: 0, limit: 10 }});
      }
    },
    created() {
      let curVal = window.localStorage.getItem("walletData");
      if (curVal) {
        this.walletDetails = JSON.parse(curVal);
        this.timer = setInterval(() => {
          const newVal = window.localStorage.getItem('walletData');
          if (newVal !== curVal) {
            curVal = newVal;
            // fireEvent, update state, etc
            // or update data in your component
            this.walletDetails = JSON.parse(newVal)
          }
        }, 1000);
      } else {
        this.fetchData();
      }
    },
    beforeUnmount() {
      if (this.timer) {
        clearInterval(this.timer)
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