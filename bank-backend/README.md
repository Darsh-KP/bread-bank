# Breadwinners Financial Services (BFS) — Backend

## Overview

The backend is built with Java 21 and Spring Boot. It provides a REST API for the BFS Angular frontend and handles authentication, user management, bank account operations, deposits, withdrawals, transfers, and transaction history.

The application uses JWT-based authentication with refresh token support to secure protected API endpoints. It integrates with a PostgreSQL database to store and manage banking data persistently. Maven Wrapper is included to simplify building and running the application without requiring a separate Maven installation.

## Prerequisites

- **Java Development Kit (JDK 21.0.12.1)** installed and available on your `PATH`.

> **Note:** Maven does **not** need to be installed separately. This project uses the Maven Wrapper (`mvnw` / `mvnw.cmd`), which is included in the repository.

## Getting Started

### Set the Database Environment Variables

Configure the environment variables required to connect to your PostgreSQL database:

```text
DB_URL=<path_to_db>
DB_USERNAME=<your_db_username>
DB_PASSWORD=<your_db_password>
```

*Replace the placeholder values with your actual database connection details.*

**Windows (PowerShell)**

- Per session:

  ```powershell
  $env:DB_URL="your_database_url"
  $env:DB_USERNAME="your_db_username"
  $env:DB_PASSWORD="your_db_password"
  ```

- Permanent: Add `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` to your system environment variables.

**macOS / Linux**

- Per session:

  ```bash
  export DB_URL="your_database_url"
  export DB_USERNAME="your_db_username"
  export DB_PASSWORD="your_db_password"
  ```

- Permanent: Add the `export` commands to your shell profile (e.g., `~/.bashrc` or `~/.zshrc`), then reload the profile or open a new terminal.

> **Note:** Ensure PostgreSQL is running, the target database exists, and the database tables have been created using the SQL scripts in the `data/` directory.

### Compile the Code

From a terminal, **navigate** to the backend project root directory.

**Windows (PowerShell)**

```powershell
.\mvnw.cmd clean compile
```

**macOS / Linux**

```bash
./mvnw clean compile
```

### Run the Backend Server

After compiling the project, run the application from the backend project root directory.

**Windows (PowerShell)**

```powershell
.\mvnw.cmd -q exec:java "-Dexec.mainClass=com.breadwinners.BankBackendApplication"
```

**macOS / Linux**

```bash
./mvnw -q exec:java "-Dexec.mainClass=com.breadwinners.BankBackendApplication"
```

Once the application starts successfully, the backend server will be available at http://localhost:8080.

## Notes

- Ensure the required database environment variables are configured before starting the application.
- Keep database credentials private and do not commit them to version control.
- Refer to the main project README and the `data/` directory README for database setup instructions.
- Use the Maven Wrapper commands appropriate for your operating system.
