# Simple Blockchain Prototype

This is a simple blockchain prototype implemented in TypeScript with Node.js and Express.js. It demonstrates basic blockchain functionalities such as adding blocks, managing transactions, and wallet operations.

## Features

- **Blockchain**: Implements a basic blockchain with blocks, transactions, and proof-of-work.
- **Wallet**: Manages wallets and their balances.
- **Transactions**: Supports transaction creation, validation, and inclusion in blocks.
- **API**: Provides RESTful API endpoints for interacting with the blockchain.

## Technologies Used

- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- Node.js installed
- npm (Node Package Manager) installed
- Clone the repository: `git clone https://github.com/EduardoSilva09/Web23.git`
- Install dependencies: `npm install`
- Set up environment variables: Create a `.env` file. Check the [`.env.example`](https://github.com/EduardoSilva09/Web23/blob/master/protochain/.env.example)

### Installation

1. Clone the repo
   
   ```sh
   git clone https://github.com/EduardoSilva09/Web23.git
   ```
   
2. Install NPM packages

   ```sh
    npm install
   ```
   
3. Set environment variables

## Usage

1. Run the server

   ```sh
   npm start
   ```

2. Access the API at `http://localhost:${PORT}`

  - API Endpoints
  - GET /status: Get blockchain status.
  - GET /blocks/next: Get details of the next block.
  - GET /blocks/:indexOrHash: Get details of a specific block by index or hash.
  - POST /blocks: Add a new block to the blockchain.
  - GET /transactions/:hash?: Get transactions in mempool or details of a specific transaction.
  - POST /transactions: Add a new transaction to the mempool.
  - GET /wallets/:wallet: Get wallet details including balance and UTXO.
