import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../middleware/error.middleware';

const userService = new UserService();

export class ProfileController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        throw new AppError('User ID not found', 400);
      }

      const profile = await userService.getProfile(userId);

      res.status(200).json({
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      const { firstName, lastName, currencyPreference, theme } = req.body;

      if (!userId) {
        throw new AppError('User ID not found', 400);
      }

      const updatedProfile = await userService.updateProfile(userId, {
        firstName,
        lastName,
        currencyPreference,
        theme,
      });

      res.status(200).json({
        status: 'success',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}