import http from "../http-common";

class WalletDataService {
  get(id) {
    return http.get(`/wallet/${id}`);
  }

  create(data) {
    return http.post("/setup", data);
  }

  createtransaction(walletId, data) {
    return http.post(`/transact/${walletId}`, data)
  }

  getAllTransaction(walletId, skip, limit, sort) {
    return http.get(`/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}&sort=${sort}`);
  }

  getTransactionCount(walletId) {
    return http.get(`/transactions/count?walletId=${walletId}`);
  }

  downloadToCsv(walletId) {
    return http.get(`/download/${walletId}`);
  }
}

export default new WalletDataService();