// api/register.js
import { connectToDB } from '../db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Missing username or password' });

  try {
    const db = await connectToDB();
    const existing = await db.collection('users').findOne({ username });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const result = await db.collection('users').insertOne({ username, password });
    res.status(201).json({ id: result.insertedId, username });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
}
