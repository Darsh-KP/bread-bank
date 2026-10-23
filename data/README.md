# Breadwinners Financial Services (BFS) — Database Scripts

This directory contains SQL scripts for setting up, populating, and resetting the PostgreSQL database used by Breadwinners Financial Services (BFS).

| Script | Description |
| - | - |
| db_creation | Creates the database tables required by the application. |
| db_sample_data | Inserts sample users, accounts, and other sample records into the database. |
| db_delete	| Drops the application tables to reset the database. |

## Getting Started

### Set Up PostgreSQL

Install and configure PostgreSQL if you have not already done so.

> Create a PostgreSQL database for BFS using your preferred database management tool or the PostgreSQL command line.

### Create the Database Tables

Run the `db_creation` script against the BFS database to create the required tables.

### Populate the Sample Data (Optional)

To insert the sample users, accounts, and other available test records, run the `db_sample_data` script.

> Make sure the database creation script has been executed successfully before loading the sample data.

### Sample User Credentials

The sample data includes the following users for development and testing.

| Username | Password | Account PIN |
| - | - | - |
| `billy` | `Password123` | `1234` |
| `sally` | `Password123` | `1234` |
| `slagathor` | `Password123` | `1234` |

> **Important:** These credentials are intended for development and testing only. Do not use these credentials in a production environment.

### Resetting the Database

If you need to reset the database and remove the existing application tables, execute the `db_delete` script.

> **Warning:** This script drops the application tables and deletes the data stored in them. Back up any data you need to keep before running it.

## Notes
- Ensure PostgreSQL is running and that you have permission to create and modify database tables.
- Execute all scripts against the intended BFS database.
- The script filenames used in the commands assume a .sql extension. Adjust the filenames or paths to match the actual files in this directory.
- The sample credentials should only be used in local development and testing environments.