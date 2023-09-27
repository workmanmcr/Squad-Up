import { db } from "../connect.js";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
  `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const { desc, postId } = req.body;
  const userId = req.user.id;

  const q =
    "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?, ?, ?, ?)";
  const values = [
    desc,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    userId,
    postId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Comment has been created.");
  });
};

export const deleteComment = (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

  db.query(q, [commentId, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows > 0) return res.json("Comment has been deleted!");
    return res.status(403).json("You can delete only your comment!");
  });
};
