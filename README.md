# mydigiwallet
This website let you setup a new wallet and ability to record credit/debit transaction.

# Quick-Start Guide
This is quick start guide to setup and run the MyDigi Wallet

# Pre-requisite
- Install Node.Js v18.15.0
- Install MongoDB v6.0.5
- You should have postman installed to test api endpoints

# Setup
- Clone the repo
- create a .env file in this folder and mention two different env variables
  - **MONGO_URI** uri path to connect to database
- open a new terminal and go to folder `backend/` and run command `npm install && node server.js`, your sails app should be running at `http://localhost:8081`
- open this link [http://localhost:8080/home](http://localhost:8080) into browser 

## Sample

##### This is how your browser window looks like when you visit the page for the first time

![image](https://user-images.githubusercontent.com/128895452/228024025-45a9240f-8420-4106-b8f1-9f491aaeb26a.png)

##### After a wallet is setup this view will be visible to the user to capture transaction as well see the wallet details

![image](https://user-images.githubusercontent.com/128895452/228023845-9a4da5be-3d5b-4bb7-972c-a0548b34e72a.png)

##### Transactions Table with pagination and Export functionality

![image](https://user-images.githubusercontent.com/128895452/228023535-33d6a7be-a37f-411e-9294-3fd2d541bf77.png)


When you setup a wallet it will take you to a new page which will look like as follows


# Api Method Description

### `POST /setup`
Create a new wallet, User name should be atleast 8 characters long

#### request
```
{
  "name": "Walletname1",
  "balance": Number // optional (Can be floating point as well but upto 4 decimal number)
}
```

#### Response [200]
```
{
  "name": "Walletname1",
  "balance": 0, // If balance is not provided then will be initialized automatically to zero
  "createdAt": "2023-03-26T19:27:39.424Z",
  "updatedAt": "2023-03-26T19:27:39.424Z",
  "__v": 0,
  "id": "64209cab5df7692750ed7d0f"
}
```

#### Response [400]
```
If name field is missing
Error Message: Please provide wallet name to setup an wallet
```


#### Response [400]
```
If balance input is not a valid number
Error Message: Please provide a correct input for balance
```


### `GET /wallet/:id`

Login at the platform

#### Request
```
http://localhost:8081/wallet/64209cab5df7692750ed7d0f
```

#### Response [200]
```
{
  "name": "Walletname1",
  "balance": 0,
  "createdAt": "2023-03-26T19:27:39.424Z",
  "updatedAt": "2023-03-26T19:27:39.424Z",
  "__v": 0,
  "id": "64209cab5df7692750ed7d0f"
}
```

#### Response [404]
If provided WalletId does not bleong to any wallet
Error Message: No wallet exists with these details

### `POST /transact/:walletId`

To perform a transaction (Credit/Debit) in any wallet

#### request
```
{
  "amount": 500, // Should be a number and required
  "description": 'Description of transaction' // Optional
  "type": "CREDIT" // required can be one of these // "CREDIT/DEBIT"
}
```

#### Response [200]
```
{
  "balance": 500,
  "transactionId": "64209cab5df7692750ed7d11"
}
```

#### Response [400]
```
This response can be in one of these condition
- Invalid Wallet Id provided (Error Message: "Please provide wallet id to fetch wallet details")
- Invalid Amount provided or not amount provided (Error Message: "Please provide a valid amount")
- type can be of one of available types only (Error Message: "Transaction can be a type of Debit/Credit")
- If wallet does not exists with the given walletId (Error Message: "Wallet with this wallet id does not exists")
- If transaction type is debit and it exccedes the available balance in the wallet (Error Message: "You have insufficent funds in your wallet")
```

#### NOTES
- If description is not provided then if transaction type is **Credit** then by default it will be **Recharge**


### `GET /transactions/:walletId`

Get all the transactions relate to a wallet, it supports pagination and sort based on fields

#### Response [200]
```
[
  {
    "description": "Setup",
    "walletId": "64209cab5df7692750ed7d0f",
    "amount": 400,
    "balance": 400,
    "type": "CREDIT",
    "date": "2023-03-26T19:27:39.455Z",
    "id": "64209cab5df7692750ed7d11"
  }
]
```

### `GET /download/:walletId`

Downalod a csv file for all transactions

#### Response [200]
```
Csv File
```

# DEMO
You can view a live demo of the webapp visiting [digiwallet](https://digiwallet.onrender.com/)
