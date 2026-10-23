# Breadwinners Financial Services (BFS) — Frontend

## Overview

The frontend is built with Angular and TypeScript. It integrates with a Spring Boot REST API backend and a PostgreSQL database to support authentication, bank account management, deposits, withdrawals, transfers, and transaction history.

The application uses JWT-based authentication with refresh token support to manage authenticated access to protected backend endpoints. Banking data is stored in the database, enabling persistent data management across sessions.

## Getting Started

### Prerequisites

- **Node.js:** 24.21.0 — [Download Node.js](https://nodejs.org/en/download/archive/v24.21.0)
- npm (included with Node.js)

### Installation

Navigate to the frontend directory:

```bash
cd bank-frontend
```

Install dependencies:

```bash
npm install
```

### Run the Application

Start the Angular development server:

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.