# 🚀 Opportunity Report (Salesforce LWC)

This project is a solution for the CloudBudget developer test case.

It enhances an Opportunity Report interface using Salesforce Lightning Web Components (LWC) and Apex.

---

## 🎯 Features

### 📊 Data Table Enhancements
- Displays Opportunity data with additional fields:
  - Name
  - Fiscal Year
  - Amount
  - Stage
  - Description
  - Close Date

---

### 🔍 Filtering
Users can filter Opportunities by:
- Year (Fiscal Year)
- Stage (Picklist)
- Close Date

Filters are applied dynamically and update the table in real time.

---

### 🔄 Sorting
- Sorting is supported on all columns
- Implemented using server-side sorting (Apex)

---

### 💰 Dynamic Total
- Displays total Amount of all visible (filtered) Opportunities
- Automatically recalculates when filters change

---

### ⚙️ Row Actions
Each row includes:
- **Edit** → Opens standard Salesforce edit page
- **Delete** → Removes record and refreshes table

---

### 📁 Export CSV
- Export currently filtered data to CSV file
- Includes all visible columns

---

## 🧠 Architecture

### Frontend
- Lightning Web Components (LWC)
- `lightning-datatable`
- Reactive UI with filters and sorting

### Backend
- Apex Controller:
  - Dynamic SOQL query
  - Filtering
  - Sorting
- Secure handling of parameters (whitelisting fields)

---

## 🔧 Technologies Used

- Salesforce Platform
- LWC (Lightning Web Components)
- Apex
- SOQL
- SLDS (Salesforce Lightning Design System)

---

## ▶️ How to Run

1. Deploy the project to a Salesforce org:
   ```bash
   sf project deploy start --source-dir force-app

2.	Open org:
    ```
    sf org open

3.	Create a Lightning Tab for the component:
	
    •	Setup → Tabs → Lightning Component Tabs → New
	•	Select OpportunityReport
4.	Add the tab to any Lightning App (App Manager)
5.	Create sample Opportunity data

⸻

👤 Author

Dinmukhamed Sailau
