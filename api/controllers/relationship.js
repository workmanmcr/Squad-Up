import { db } from "../connect.js";

export const getRelationships = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const user = req.user; // Assuming you have middleware to authenticate the user
  if (!user) {
    return res.status(401).json("Not logged in!");
  }

  const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
  const values = [user.id, req.body.userId];

  db.query(q, [values], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json("Following");
  });
};

export const deleteRelationship = (req, res) => {
  const user = req.user; // Assuming you have middleware to authenticate the user
  if (!user) {
    return res.status(401).json("Not logged in!");
  }

  const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

  db.query(q, [user.id, req.query.userId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json("Unfollow");
  });
};
