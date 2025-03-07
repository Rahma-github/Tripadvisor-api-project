
const createUser = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName ) {
        let err = new Error("First Name is required");
        err.status = 400;
        return next(err);
    }
    if (!lastName) {
        let err = new Error("Last Name is required");
        err.status = 400;
        return next(err);
    }
    if (!email) {
        let err = new Error("Email is required");
        err.status = 400;
        return next(err);
    }
    // Email format validation
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        let err = new Error("Invalid email format");
        err.status = 400;
        return next(err);
    }
    if (!password) {
        let err = new Error("Password is required");
        err.status = 400;
        return next(err);
    }
    if (password.length < 10) {
        let err = new Error("Password must be at least 10 characters long");
        err.status = 400;
        return next(err);
    }
    // Contains a special character
    if (!/[!@#$%^&*]/.test(password)) {
        let err = new Error("Password must contain a special character");
        err.status = 400;
        return next(err);
    }

    next();
    }

    const loginUser = (req, res, next) => {
        const { email, password } = req.body;
        if (!email) {
            let err = new Error("Email is required");
            err.status = 400;
            return next(err);
        }
        if (!password) {
            let err = new Error("Password is required");
            err.status = 400;
            return next(err);
        }
        next();
    }
module.exports = {
    createUser,
    loginUser,
};