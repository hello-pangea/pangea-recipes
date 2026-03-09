import { Resend } from 'resend';
import { config } from '#src/config/config.ts';

export const resend = new Resend(config.RESEND_SECRET_KEY);
