# 📓 Personal Blogging Platform API By Williams Anetor

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![Express](https://img.shields.io/badge/Express.js-4.x-blue)

## 🔍 Description

This is a **RESTful API** built using **Node.js** and **Express** and **MongoDB** that allows users to create, read, update, and delete blog posts. The API supports advanced querying features like filtering, pagination, and sorting.

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🚀 Features

- CRUD operations for blog posts
- Filtering by date and tags
- Pagination and sorting
- Input validation
- Error handling
- MongoDB integration with Mongoose
- Basic security with Helmet and Rate Limiting (to be added)

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **dotenv** for environment configuration
- **morgan** for HTTP request logging
- **Joi** for input validation (planned)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blogging-platform-api.git
   ```

````

2. Navigate into the project directory:

   ```bash
   cd blogging-platform-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and add the following:

   ```env
   DATABASE_CONNECTION_URI=your-mongodb-uri
   PORT=3000
   ```

5. Run the server:
   ```bash
   npm start
   ```

## ⚙️ Usage

Make API requests using Postman or cURL:

- **Get all blogs:** `GET /blog`
- **Create a blog post:** `POST /blog`
- **Get a specific blog:** `GET /blog/:id`
- **Update a blog:** `PATCH /blog/:id`
- **Delete a blog:** `DELETE /blog/:id`

### Example Request

```bash
curl -X POST http://localhost:3000/blog \
-H "Content-Type: application/json" \
-d '{"title": "My First Blog", "content": "Hello, world!", "author": "Jane Doe"}'
```

## 📑 API Documentation

| Method | Endpoint    | Description             |
| ------ | ----------- | ----------------------- |
| GET    | `/blog`     | Retrieve all blog posts |
| GET    | `/blog/:id` | Retrieve a single blog  |
| POST   | `/blog`     | Create a new blog post  |
| PATCH  | `/blog/:id` | Update a specific blog  |
| DELETE | `/blog/:id` | Delete a blog post      |

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📜 License

This project is licensed under the MIT License.

## 📬 Contact

Created by [Williams Anetor](https://x.com/TheDevNetor) - feel free to connect!

```
https://roadmap.sh/projects/blogging-platform-api
```
````
