import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

export const authorizeRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Token bulunamadı veya geçersiz.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
    }

    next();
  };
};

