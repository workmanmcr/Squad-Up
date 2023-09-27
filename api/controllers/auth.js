import { db } from "../connect.js";
import bcrypt from "bcryptjs";

export const register = (req, res) => {
  const { username, email, password, name } = req.body;

  // CHECK IF USER EXISTS
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";

  db.query(checkUserQuery, [username], (err, userData) => {
    if (err) return res.status(500).json(err);
    if (userData.length) return res.status(409).json("User already exists!");

    // CREATE A NEW USER
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const insertUserQuery =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?, ?, ?, ?)";

    const values = [username, email, hashedPassword, name];

    db.query(insertUserQuery, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const { username, password } = req.body;

  // CHECK IF USER EXISTS
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";

  db.query(checkUserQuery, [username], (err, userData) => {
    if (err) return res.status(500).json(err);
    if (userData.length === 0) return res.status(404).json("User not found!");

    const user = userData[0];

    // CHECK PASSWORD
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json("Wrong password or username!");

    // Create a simplified user object to send in the response
    const simplifiedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    };

    return res.status(200).json(simplifiedUser);
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none",
  }).status(200).json("User has been logged out.");
};
