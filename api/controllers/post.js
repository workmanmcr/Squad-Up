import { db } from "../connect.js";
import jsonErrorHandler from "../jsonErrorHandler.js"

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const user = req.user; // Assuming you have middleware to authenticate the user
  if (!user) return res.status(401).json("Not logged in!");

  console.log(userId);

  const q =
    userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
  LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
  ORDER BY p.createdAt DESC`;

  const values =
    userId !== "undefined" ? [userId] : [user.id, user.id];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addPost = (req, res) => {
  const user = req.user; // Assuming you have middleware to authenticate the user
  if (!user) return res.status(401).json("Not logged in!");

  const q =
    "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
  const values = [
    req.body.desc,
    req.body.img,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    user.id,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post has been created.");
  });
};

export const deletePost = (req, res) => {
  const user = req.user; // Assuming you have middleware to authenticate the user
  if (!user) return res.status(401).json("Not logged in!");

  const q =
    "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

  db.query(q, [req.params.id, user.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
    return res.status(403).json("You can delete only your post");
  });
};
