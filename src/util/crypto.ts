import * as bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  rawPassword: string,
) => {
  const result = await bcrypt.compare(password, rawPassword);
  return result;
};
