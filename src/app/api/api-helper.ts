import { NextResponse } from 'next/server';
type NextResponseJson<T> = {
  message?: string;
  success?: number;
  data?: T;
};
export const unAuthroizedResponse = ({ message }: NextResponseJson<unknown>): NextResponse => {
  return NextResponse.json(
    {
      success: 0,
      message,
    },
    {
      status: 401,
    }
  );
};

export const notFoundResponse = ({ ...props }: Omit<NextResponseJson<unknown>, 'data'>): NextResponse => {
  return NextResponse.json(
    {
      success: 0,
      message: props.message || 'Not found',
    },
    {
      status: 404,
    }
  );
};

export function createdResponse<T>({ ...props }: NextResponseJson<T>) {
  return NextResponse.json(
    {
      ...props,
      message: props.message || 'Created successfully',
    },
    {
      status: 201,
    }
  );
}

export function badRequestResponse<T>(params: NextResponseJson<T>): NextResponse {
  return NextResponse.json(
    {
      success: 0,
      message: params.message || 'Bad request',
      data: params.data,
    },
    {
      status: 400,
    }
  );
}
