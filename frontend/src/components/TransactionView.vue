<template>
    <tabledata :is-slot-mode="true" :is-loading="table.isLoading" :columns="table.columns" :rows="table.rows"
        :total="table.totalRecordCount" :sortable="table.sortable" @do-search="getDataFromApi"
        @is-finished="table.isLoading = false">
        <template v-slot:name="data">
            {{ data.value.name }}
        </template>
    </tabledata>
    <div>
        <router-link :to="createTransactionUrl" @navigate="myNavigateHandler">Create Transaction</router-link>
    </div>
</template>
  
<script>
// import type { Header, ServerOptions, Item } from "vue3-easy-data-table";
import WalletDataService from "../services/walletservice";
import moment from "moment";
import { defineComponent, reactive } from "vue";
import { useRoute } from 'vue-router';
// import { TableLite } from 'vue3-table-lite';

export default defineComponent({
    name: "transactionsView",
    // components: { TableLite },
    setup() {
        // Init Your table settings
        const route = useRoute();
        const table = reactive({
            isLoading: false,
            columns: [
                {
                    label: "Transaction Date",
                    field: "date",
                    width: "15%",
                    sortable: true,
                    display: function(row) {
                        return moment(row.date).format("MMMM Do YYYY, h:mm:ss a")
                    },
                    isKey: true,
                },
                {
                    label: "Transaction Amount (In Rs)",
                    field: "amount",
                    width: "10%",
                    sortable: true,
                },
                {
                    label: "Balance Amount (In Rs)",
                    field: "balance",
                    width: "10%",
                    sortable: true,
                },
                {
                    label: "Transaction Type",
                    field: "type",
                    width: "5%",
                    sortable: false,
                },
                {
                    label: "Transaction Description",
                    field: "description",
                    width: "15%",
                    sortable: false,
                },
            ],
            rows: [],
            totalRecordCount: 0,
            sortable: {
                order: "date",
                sort: "desc",
            },
        });
        const createTransactionUrl = `/wallet/${route.query.walletId}`;
        const getDataFromApi = (offset, limit, order, sort) => {
            const walletId = route.query.walletId;
            table.isLoading = true;

            WalletDataService.getTransactionCount(walletId)
            .then(response => {
                table.totalRecordCount = response.data.count;
            }).catch(e => {
                console.log(e);
            }).finally(() => table.isLoading = false);


            WalletDataService.getAllTransaction(walletId, offset, limit, JSON.stringify({order: sort}))
            .then(response => {
                table.rows = response.data;
                table.sortable.order = order;
                table.sortable.sort = sort;
            }).catch(e => {
                console.log(e);
            }).finally(() => table.isLoading = false);
        };
        // Get data first
        getDataFromApi(0, 10, 'createdAt', 'desc');

        return {
            table,
            getDataFromApi,
            createTransactionUrl
        };
    }
})
</script>