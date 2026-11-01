// Only expose the fields the client actually needs.
export const publicUser = (u) => ({
  _id: u._id,
  username: u.username,
  avatar: u.avatar,
  bio: u.bio,
  createdAt: u.createdAt,
});

export const privateUser = (u) => ({ ...publicUser(u), email: u.email });
