const User = require('../models/user')
const { OAuth2Client } = require('google-auth-library');

const addUser = async (data) => {
    try {
        const user = new User(data);
        await user.save();
        return user;
    } catch (err) {
        throw err;
    }
};

const findUser = async (query) => {
  try {
    const user = await User.findOne(query);
    return user;
  } catch (err) {
    throw err;
  }
};

const getGoogleUserData = async (token) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        throw error;
    }
}

const editProfileData = async (userId, updatedData) => {
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true, runValidators: true });
    if (!updatedUser) throw new Error("This user not found");
    return updatedUser;
};

const viewProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("This user not found");
    return user;
};

const followUser = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);
  if (!currentUser || !targetUser) throw new Error('User not found');

  if (!currentUser.following) currentUser.following = { userId: [], counter: 0 };
  if (!targetUser.followers) targetUser.followers = { userId: [], counter: 0 };

  if (currentUser.following.userId.includes(targetUserId)) {
      throw new Error('You already follow this user');
  }

  await User.findByIdAndUpdate(currentUserId, {
      $push: { "following.userId": targetUserId },
      $inc: { "following.counter": 1 }
  });

  await User.findByIdAndUpdate(targetUserId, {
      $push: { "followers.userId": currentUserId },
      $inc: { "followers.counter": 1 }
  });

  return { message: 'Followed successfully' };
};

const unfollowUser = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);
  if (!currentUser || !targetUser) throw new Error('User not found');

  if (!currentUser.following?.userId.includes(targetUserId)) {
      throw new Error("You're not following this user");
  }

  await User.findByIdAndUpdate(currentUserId, {
      $pull: { "following.userId": targetUserId },
      $inc: { "following.counter": -1 }
  });

  await User.findByIdAndUpdate(targetUserId, {
      $pull: { "followers.userId": currentUserId },
      $inc: { "followers.counter": -1 }
  });

  return { message: 'Unfollowed successfully' };
};

module.exports = {
  findUser,
  addUser,
  getGoogleUserData,
  followUser,
  unfollowUser,
  editProfileData,
  viewProfile
};
