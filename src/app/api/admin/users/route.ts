import { DEFAULT_SALT_ROUNDS } from '@/app/api/admin/users/constraints';
import { badRequestResponse, createdResponse, unAuthroizedResponse } from '@/app/api/api-helper';
import { RegisterSchema } from '@/validations/auth.validator';
import { db } from '@lib/db';
import { genSalt, hashPassword } from '@lib/hashHelper';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { name, email, password: rawPassword, role, image } = RegisterSchema.parse(json);

  // TODO: check if user is authenticated and is operator
  const isAllowedToCreate = true;

  if (!isAllowedToCreate) {
    return unAuthroizedResponse;
  }

  const existingUser = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return badRequestResponse('User already exists');
  }

  const salt = genSalt(DEFAULT_SALT_ROUNDS);
  const password = hashPassword(rawPassword, salt);

  //Create new user
  const newUser = await db.user.create({
    data: {
      name,
      email,
      password,
      role,
      image,
    },
  });

  return createdResponse(newUser);
}
