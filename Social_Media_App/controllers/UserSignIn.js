const User = require("../models/user");
const bcrypt = require('bcrypt');
const { generateRefreshToken, generateAccessToken } = require("../service/auth");
const { default: mongoose } = require("mongoose");

async function userSignIn(req, res) {
    try {
        const { name, password, phoneNumber, email, bio, gender, username } = req.body;
        const saltround = 10;
        const hashedPassword = await bcrypt.hash(password, saltround);

        await User.create({ name, password: hashedPassword, phoneNumber, email, bio, gender, username, isActive: true });
        return res.status(200).json({
            message: "User created successfully"
        })

    }
    catch (error) {
        return res.status(400).json({
            message: "Error occured in signing up a user",
            error: error.message,
        })
    }
}

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log("Logged in user", user);
        if (!user) {
            return res.status(404).json({
                message: "Invalid User"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const userForRefreshToken = {
            id: user._id
        }

        const userForAccessToken = {
            id: user._id,
            email: user.email,
            username: user.username,
        }

        const refreshToken = generateRefreshToken(userForRefreshToken);
        const accessToken = generateAccessToken(userForAccessToken);

        return res.status(200).json({
            message: "User found",
            "refresh_token": refreshToken,
            "access_token": accessToken
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Error occured during login",
            error: error.message,
        })
    }
}

//to get all the users
async function getUsers(req, res) {
    try {
        const users = await User.find();
        console.log("All Users:", users);

        if (!users || users.length == 0) {
            return res.status(404).json({
                message: 'No users found'
            })
        }

        return res.status(200).json({
            message: "Users retrieved successfully",
            users: users,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Error occured in fetching users data",
            error: error.message
        })
    }
}

//get user by id
async function userById(req, res) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            })
        }
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User found",
            user: user
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Error occured",
            error: error.message
        })
    }
}

//edit user profile
async function editUserProfile(req, res) {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
            })
        }

        const { name, gender, bio, username, phoneNumber, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { name, gender, bio, username, phoneNumber, email });
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        return res.status(200).json({
            message: "User profile updated successfully",
            user: updatedUser,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Error occured in updating user profile",
            error: error.message
        })
    }
}

//follow/unfollow user
async function followOrUnfollowUser(req, res) {
    try {
        const targetUserId = req.params.id;
        const authenticatedUserId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({
                message: "Invalid user ID",
            })
        }

        if (targetUserId === authenticatedUserId) {
            return res.status(400).json({
                message: "Unable to follow/unfollow yourself"
            })
        }

        const targetedUser = await User.findById(targetUserId);
        const authenticatedUser = await User.findById(authenticatedUserId);

        if (!targetedUser) {
            return res.status(404).json({
                message: "User to follow/unfollow not found"
            })
        }

        const isFollowing = authenticatedUser.following.includes(targetUserId);
        if (isFollowing) {
            authenticatedUser.following = authenticatedUser.following.filter((user) => user !== targetUserId);
            targetedUser.followers = targetedUser.followers.filter((user) => user !== authenticatedUser);

            await authenticatedUser.save();
            await targetedUser.save();

            return res.status(200).json({
                message: `You have  unfollowed ${targetedUser.username}`
            })
        }
        else {
            authenticatedUser.following.push(targetUserId);
            targetedUser.followers.push(authenticatedUser);

            await authenticatedUser.save();
            await targetedUser.save();

            return res.status(200).json({
                message: `You are now following ${targetedUser.username}`
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error occured in following/unfollowing the user',
            error: error.message
        })
    }

}

//Activate or Deactivate User Account
async function activateOrDeactivateAccount(req, res) {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user id",
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        user.isActive = !user.isActive;
        await user.save();

        return res.status(200).json({
            message: user.isActive ? "Account has been deactivated successfully" : "Account has been activated successfully"
        })

    }
    catch (error) {
        return res.status(500).json({
            message: "An error occured while activating/deactivating account",
            error: error.message,
        })
    }
}

//change public/private mode
async function changePrivacyMode(req, res) {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user id"
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        user.accountType = (user.accountType === "Public") ? "Private" : "Public";
        await user.save();

        return res.status(200).json({
            message: `Acount privacy mode successfully changed to ${user.accountType}`,
        })

    }
    catch (error) {
        return res.status(500).json({
            message: "Error occured while changing account privacy mode",
            error: error.message,
        })
    }
}


module.exports = { userSignIn, userLogin, getUsers, userById, followOrUnfollowUser, activateOrDeactivateAccount, changePrivacyMode, editUserProfile };