# OKB Backend

Express.js backend server for OKB project.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create `.env` file:
   ```
   PORT=5000
   ```

3. Run server:
   ```
   npm start
   ```

4. Dev mode (with auto-reload):
   ```
   npm run dev
   ```

## Folder Structure

```
Backend/
  ├── index.js          # Main server file
  ├── package.json      # Dependencies
  ├── .env              # Environment variables
  ├── Controller/       # Business logic
  ├── Module/           # Data models
  ├── Routes/           # API routes
  └── Middleware/       # Custom middleware (create as needed)
```
