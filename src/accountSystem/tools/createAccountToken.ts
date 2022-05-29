import { uuid } from 'uuidv4';

export default function createAccountToken() {
  const token = uuid();
  return { token: token, createdAt: new Date() };
}
