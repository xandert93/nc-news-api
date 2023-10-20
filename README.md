# NC News API

https://nc-news-api-6aaq.onrender.com/

## Project Summary

Server to enable PostgreSQL Database CRUD via Express and node-postgres.

### Get started:

Follow these instructions to clone the project, set up the database, and run the project locally.

1. Clone repo to your local machine:

   ```bash
   git clone https://github.com/xandert93/nc-news-api
   ```

2. Create two `.env` files: `.env.test` and `.env.development`. Add the following to each, replacing `<database-name>` with the appropriate database name:

   ```
   PGDATABASE=<database-name>
   ```

   Ensure that these `.env` files are added to your `.gitignore`.

### Install Dependencies

1. Install project dependencies:

   ```bash
   npm install
   ```

### PostgreSQL configuration

1. In the root directory, you will find a `db` folder containing data, a `setup.sql` file, and a `seeds` folder.

2. Review table creation commands in the `seed.js` file to understand the database structure.

### Running the Project

Ensure you have the minimum required versions of Node.js and PostgreSQL installed:

- Node.js: v20.8.0
- PostgreSQL: v16.0.0

Now, you can run the project:

```bash
npm start
```

## Core Tasks

Here's a brief overview of the core tasks you'll be working on:

- `GET /api`: Get a list of available endpoints.

- `GET /api/topics`: Get a list of topics.

- `GET /api/articles`: Get a list of articles.
- `GET /api/articles/:id`: Get a single article by ID.
- `PATCH /api/articles/:id`: Update an article.

- `DELETE /api/comments/:id`: Delete a comment.
- `GET /api/comments/article_id/:article_id`: Get comments for an article.
- `POST /api/comments/article_id/:article_id`: Add a comment to an article.

- `GET /api/users`: Get a list of users.

- `GET /api/articles (queries)`: Filter and sort articles.
- `GET /api/articles/:id (comment count)`: Get an article with a comment count.
