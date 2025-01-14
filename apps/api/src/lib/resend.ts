import { config } from '#src/config/config.js';
import { Resend } from 'resend';

export const resend = new Resend(config.RESEND_SECRET_KEY);
