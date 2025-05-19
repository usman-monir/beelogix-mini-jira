import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: Document & {
        _id: any;
        name: string;
        email: string;
        password: string;
        comparePassword(candidatePassword: string): Promise<boolean>;
        generateAuthToken(): string;
      };
    }
  }
}
