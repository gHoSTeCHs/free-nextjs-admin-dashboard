import { handlers } from '@/auth';
import authConfig from '@/authConfig';
import NextAuth from 'next-auth';

export const GET = handlers.GET;
export const POST = handlers.POST;

export default NextAuth(authConfig);
