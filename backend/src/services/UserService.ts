import User, { IUser, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserService {
  async createUser(username: string, email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = username === 'beyza' ? UserRole.ADMIN : UserRole.USER;
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    return user.save();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    try {
      console.log('Finding user by username:', username);
      
      // Önce kullanıcıyı bul
      const user = await User.findOne({ username: username });
      console.log('Database query result:', user);
      
      if (!user) {
        console.log('User not found in database');
        return null;
      }

      // beyza kullanıcısı için özel kontrol
      if (username === 'beyza' && user.role !== UserRole.ADMIN) {
        console.log('Updating beyza user to ADMIN role');
        user.role = UserRole.ADMIN;
        const savedUser = await user.save();
        console.log('Updated user:', savedUser);
        return savedUser;
      }

      console.log('Returning found user:', user);
      return user;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error; // Hatayı yukarı fırlat
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find().select('-password');
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      return await User.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
}
