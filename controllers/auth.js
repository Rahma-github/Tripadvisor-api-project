const userServices = require("../services/user");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Check if the user already exists
    const user = await userServices.findUser({ email });
    if (user) {
      let err = new Error("User already exists");
      err.status = 400;
      throw err;
    }
    // If the user does not exist, create a new user
    const newUser = await userServices.addUser({ firstName,lastName, email, password });
    // Send the user object as a response
    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const login =async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists
    const user = await userServices.findUser({ email });
    if (!user) {
      let err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      let err = new Error("Invalid password");
      err.status = 400;
      throw err;
    }
    // Generate a token
    const token = await user.generateToken();
    // Send the token as a response
    res.status(200).json({
      message: "Login successful",
        token,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const googlelogin = async (req, res, next) => {
  const tokenId = req.body.token;
  try {

    //get google user data
    const userData = await authService.getGoogleUserData(tokenId);
    // Check if user exists in the database, or create a new user
    let user = await userServices.findUser({email:userData.email});
    if (!user) {
      // Create a new user
      user = await userServices.addUser({ firstName: userData.given_name, lastName: userData.family_name, email: userData.email, image: userData.picture, password: userData.email });
    }
    // Generate a token for the new user
    const token =await user.generateToken();
    // Return the token
    res.status(200).json({
      message: "Login successful",
      token,
    })
    
  } catch (error) {
    console.error('Error signing in with Google:', error);
    res.status(401).json(
      { message: error.message }
    );
  }

}

module.exports = {
  register,
  login,
  googlelogin
};