import { UserRepository } from './user-repository'
import { Users, User, Photo } from '@models/user-model'

export class UserRepositoryImpl implements UserRepository {
  async getUserDescription(username: string): Promise<string> {
    return (await Users.findOne({ username: username }).orFail()).description
  }

  async getUserPhoto(username: string): Promise<Photo> {
    return (await Users.findOne({ username: username }).orFail()).profilePicture
  }

  async updateUserPhoto(username: string, photo: Photo): Promise<void> {
    await Users.findOneAndUpdate(
      { username: username },
      { profilePicture: photo }
    ).orFail()
  }

  async updateUserDescription(username: string, description: string): Promise<void> {
    await Users.findOneAndUpdate(
      { username: username },
      { description: description }
    ).orFail()
  }

  async getUserByUsername(username: string): Promise<User> {
    return await Users.findOne({ username: username }).orFail()
  }

  async getUserByEmail(email: string): Promise<User> {
    return await Users.findOne({ email: email }).orFail()
  }

  async login(username: string, refreshToken: string): Promise<void> {
    await Users.findOneAndUpdate(
      { username: username },
      { refreshToken: refreshToken }
    ).orFail()
  }

  async logout(username: string): Promise<void> {
    await Users.findOneAndUpdate({ username: username }, { refreshToken: '' })
  }

  async createUser(
    username: string,
    email: string,
    hashedPassword: string,
    description: string | null,
    photo?: Photo
  ): Promise<User> {
    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
      description,
      photo,
    })
    return user
  }

  async deleteUser(username: string): Promise<User> {
    return await Users.findOneAndDelete({ username: username }).orFail()
  }

  async getFriends(username: string): Promise<string[]> {
    const user = await this.getUserByUsername(username)
    const friends = user.friends
    return friends
  }

  async getFriendsRequests(username: string): Promise<string[]> {
    const user = await this.getUserByUsername(username)
    return user.friendsRequests
  }

  async sendFriendRequest(username: string, friendUsername: string): Promise<void> {
    const user = await this.getUserByUsername(username)
    if (user.friends.includes(friendUsername)) {
      throw new Error('Already friends')
    }
    //if the friend Username doesn't exist
    else if (!(await Users.exists({ username: friendUsername }))) {
      throw new Error('User not found')
    } else if (
      !user.friendsRequests.includes(username) &&
      !user.pendingFriendsRequests.includes(friendUsername)
    ) {
      await Users.updateOne(
        { username: friendUsername },
        { $push: { friendsRequests: username } }
      )
      await Users.updateOne(
        { username: username },
        { $push: { pendingFriendsRequests: friendUsername } }
      )
    } else {
      throw new Error('Request already exists')
    }
  }

  async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
    let user
    try {
      user = await this.getUserByUsername(username)
    } catch (e) {
      throw new Error('User not found')
    }
    if (user.friendsRequests.includes(friendUsername)) {
      await Users.updateOne(
        { username: username },
        { $push: { friends: friendUsername } }
      )
      await Users.updateOne(
        { username: friendUsername },
        { $push: { friends: username } }
      )
      await Users.updateOne(
        { username: username },
        { $pull: { friendsRequests: friendUsername } }
      )
      await Users.updateOne(
        { username: friendUsername },
        { $pull: { pendingFriendsRequests: username } }
      )
    } else {
      throw new Error('Friend request does not exist')
    }
  }

  async denyFriendRequest(username: string, friendUsername: string): Promise<void> {
    let user
    try {
      user = await this.getUserByUsername(username)
    } catch (e) {
      throw new Error('User not found')
    }
    if (user.friendsRequests.includes(friendUsername)) {
      await Users.updateOne(
        { username: username },
        { $pull: { friendsRequests: friendUsername } }
      )
      await Users.updateOne(
        { username: friendUsername },
        { $pull: { pendingFriendsRequests: username } }
      )
    } else {
      throw new Error('Friend request does not exist')
    }
  }
}
