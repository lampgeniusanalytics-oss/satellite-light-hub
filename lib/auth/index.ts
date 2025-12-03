import { db } from '@/lib/database/schema';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  role: string;
}

export async function validateCredentials(username: string, password: string): Promise<User | null> {
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return null;
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    console.error('Error validating credentials:', error);
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(id) as any;
    return user || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
