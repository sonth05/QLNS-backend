// api/auth.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "qlns";
const collectionName = "users";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection(collectionName).findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    // Nếu dùng JWT thì tạo token tại đây
    return res.status(200).json({ token: 'dummy-token', username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
}
