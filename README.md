# LeftLovers Backend Service

This repository contains backend services from the C23-PS396 Bangkit 2023 team to provide API endpoints for our applications.

### Documentation

- https://leftlovers-backend-nqh3dgyegq-et.a.run.app/docs/#/

### Features

This app contains API for:

- Authentication and Authorization for Customer and Seller
- Merchant and Food management system
- Transaction
- Rating and Review based on the previous transaction
- Gamification
- Statistic Report for Seller
- Connected with Machine Learning system

### Deployment

This app deployed using Cloud Run service on GCP. Step for depoyment click [here](https://docs.google.com/document/d/10G2mFqKZnszAk1w3RaccxkiMChcxvZTl-z9do75D09E/edit?pli=1)

### Running on the

The quickest way to get started with express is to utilize the executable [`express(1)`](https://github.com/expressjs/generator) to generate an application as shown below:

**Install dependencies:**

```console
$ npm install
```

**Set .env variable (see .env.example)**

```
...
# Server
API_PORT=

# Databasem
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Authentication
SECRET=

GO_API_KEY=
GO_API_URL=
...
```

**Start the server:**

```console
$ npm run dev
```

**View the website at: http://localhost:8000**
