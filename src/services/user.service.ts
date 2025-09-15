import { PrismaClient, User } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  currencyPreference?: string;
  theme?: string;
}

export class UserService {
  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}