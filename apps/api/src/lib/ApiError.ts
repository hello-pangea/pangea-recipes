export class ApiError extends Error {
  statusCode: number;

  constructor(data: { name: string; message: string; statusCode?: number }) {
    super(data.message);

    this.name = data.name;
    this.statusCode = data.statusCode ?? 500;

    Error.captureStackTrace(this, this.constructor);
  }
}
