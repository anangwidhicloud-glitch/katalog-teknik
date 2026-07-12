import argon2 from 'argon2';

export async function verifyPassword(password: string, passwordHash: string) {
  return argon2.verify(passwordHash, password);
}
