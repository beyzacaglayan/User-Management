import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_key';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register isteği alındı:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Eksik bilgi:', { username, email, password });
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const existingUser = await UserService.findByUsername(username);
    if (existingUser) {
      console.log('Kullanıcı adı zaten kullanımda:', username);
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanımda' });
    }

    const user = await UserService.createUser({ username, email, password });
    console.log('Kullanıcı oluşturuldu:', user);

    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Token oluşturuldu, yanıt gönderiliyor');
    return res.status(201).json({ 
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register hatası:', error);
    return res.status(500).json({ message: 'Kayıt işlemi sırasında bir hata oluştu' });
  }
};
