const app = require('../src/app.js');
const connectDB = require('../src/db/db.js');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection error in Vercel serverless function:", err);
  }
  return app(req, res);
};
