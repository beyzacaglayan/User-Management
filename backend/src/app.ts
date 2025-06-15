import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
const PORT = process.env.PORT || 5000;


app.use(express.json());



// MongoDB bağlantısını burada yapıyoruz (db.ts'deki fonksiyon ile)
connectDB();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


