import { db } from "../connect.js";

export const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(like => like.userId));
  });
};

export const addLike = (req, res) => {
  const user = req.user; // Assuming you have middleware to authenticate the user
  if (!user) return res.status(401).json("Not logged in!");

  const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
  const values = [user.id, req.body.postId];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post has been liked.");
  });
};

export const deleteLike = (req, res) => {
  const user = req.user; // Assuming you have middleware to authenticate the user
  if (!user) return res.status(401).json("Not logged in!");

  const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

  db.query(q, [user.id, req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post has been disliked.");
  });
};
