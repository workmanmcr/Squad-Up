import { db } from "../connect.js";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const userId = req.params.userId;
  const authenticatedUserId = req.user.id;

  if (userId !== authenticatedUserId) {
    return res.status(403).json("You can update only your profile.");
  }

  const q =
    "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

  db.query(
    q,
    [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.coverPic,
      req.body.profilePic,
      userId,
    ],
    (err, data) => {
      if (err) res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can update only your profile.");
    }
  );
};
