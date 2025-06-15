import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_key';


export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log('Auth middleware çalışıyor...');
  console.log('Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token);

  if (!token) {
    console.log('Token bulunamadı');
    return res.status(401).json({ message: 'Token gerekli' });
  }

  try {
    console.log('Token doğrulanıyor...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token doğrulandı:', decoded);
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token doğrulama hatası:', err);
    return res.status(403).json({ message: 'Geçersiz token' });
  }
};
