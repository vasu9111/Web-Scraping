# Web Scraping Application


## Features

- Web scraping using Puppeteer
- Express.js server
- MongoDB database integration
- Redis caching
- Email functionality with Nodemailer
- Input validation using Joi
- Environment variable management with dotenv-safe

## Prerequisites

- Node.js 
- MongoDB
- Redis


1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
DB_URL=your_mongodb_connection_string


## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```



## API Endpoints

### Search Products
```
POST /search
```
Search for products for Amazone and Flipkart.

### Get Products
```
GET /products?limit=10&sort=price&type=1
```
Retrieve a list of all products.

### Get Product by ID
```
GET /products/:id
```
Get detailed information about a specific product.

### Get Price History
```
GET /products/:id/history
```
Retrieve the price history for a specific product.

### Refresh Product Price
```
POST /products/:id/refresh
```
 price refresh for a specific product.


## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- puppeteer: Web scraping
- redis: Caching
- nodemailer: Email functionality
- joi: Input validation
- dotenv-safe: Environment variable management
- nodemon: Development server

