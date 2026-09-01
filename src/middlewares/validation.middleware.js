const { body, validationResult } = require("express-validator");

async function validateResult(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}

const registerUser = [
    // Username validation
    body("username")
        .isString()
        .trim()
        .withMessage("Username must be a string")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),

    // Email validation
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address (e.g. name@gmail.com)")
        .normalizeEmail(),

    // Password validation
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6, max: 50 })
        .withMessage("Password must be at least 6 characters"),

    // Check validation errors
    validateResult
];

module.exports = {
    registerUser
  
};
