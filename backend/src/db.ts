// src/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/user-management';

const connectDB = async () => {
  try {
    // Önceki bağlantıyı kapat
    await mongoose.disconnect();
    
    // Yeni bağlantı
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log('MongoDB bağlantısı başarılı');
    console.log('Veritabanı:', mongoose.connection.db.databaseName);
    console.log('Bağlantı durumu:', mongoose.connection.readyState);

    // Bağlantı durumunu dinle
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB bağlantı hatası:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB bağlantısı kesildi');
    });

  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

export default connectDB;
