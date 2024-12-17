# Invoice Management
A project for managing invoices received by companies from suppliers. The system allows uploading and managing invoices from multiple suppliers, with a visual display of the data.

## Technologies
The project uses the following technologies and libraries:
- **Back-end**: 
  - Node.js
  - Express
  - PostgreSQL
  - Multer (for file handling)
  - CSV-Parser (for reading CSV files)
  - Body-Parser
- **Front-end**:
  - React
  - TypeScript
  - TailwindCSS
  - Chart.js (for creating visual graphs)
  - Axios (for making HTTP requests)
  
## System Requirements
Before running the project, you need to install the following requirements:
- Node.js (version 14 or higher)
- NPM (for managing packages)
- PostgreSQL (+ pgAdmin)
- Multer
- CSV-Parser
- React-router-dom
- react-chartjs-2
- Chart.js

### Installation
1. **Install back-end dependencies**:
   - Install dependencies for the server:
     ```bash
     npm install
     ```

   - Create the database in PostgreSQL:
     - Create a database named `invoices`.
     - Create the following tables in PostgreSQL:
       ```sql
       CREATE TABLE suppliers (
           supplier_id SERIAL PRIMARY KEY,
           supplier_internal_id VARCHAR(50) UNIQUE NOT NULL,
           supplier_external_id VARCHAR(50),
           supplier_company_name VARCHAR(255),
           supplier_address VARCHAR(255),
           supplier_city VARCHAR(100),
           supplier_country VARCHAR(50),
           supplier_contact_name VARCHAR(100),
           supplier_phone VARCHAR(50),
           supplier_email VARCHAR(100),
           supplier_bank_code INTEGER,
           supplier_bank_branch_code INTEGER,
           supplier_bank_account_number BIGINT,
           supplier_status VARCHAR(50),
           supplier_stock_value INTEGER,
           supplier_withholding_tax FLOAT
       );

       CREATE TABLE invoices (
           invoice_id SERIAL PRIMARY KEY,
           invoice_date DATE,
           invoice_due_date DATE,
           invoice_cost INTEGER,
           invoice_currency VARCHAR(10),
           invoice_status VARCHAR(50),
           supplier_id INTEGER REFERENCES suppliers(supplier_id)
       );
       ```

2. **Update DB credentials in `db.js`**:
   Update the `db.js` file with your database username and password (for example, `user: andrew`).

3. **Run the server**:
   - Navigate to the server directory:
     ```bash
     cd server
     ```
   - Run the server:
     ```bash
     node app.js
     ```

4. **Install front-end dependencies**:
   - Navigate to the client directory:
     ```bash
     cd my_client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

5. **Run the client**:
   - Start the client:
     ```bash
     npm run dev
     ```

## Uploading CSV Files
CSV files with supplier and invoice data need to be uploaded to the site. A sample CSV file will be provided inside the invoice-managment file named `invoices2.csv`.
Please note, unique values ​​must be given in supplier_internal_id.

## Contributions
If you'd like to contribute to the project, feel free to submit a Pull Request or open an Issue with suggestions for improvements.
