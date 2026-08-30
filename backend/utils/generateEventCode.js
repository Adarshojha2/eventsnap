import { customAlphabet } from 'nanoid';
import Event from '../models/Event.js';

// Alphanumeric uppercase alphabet for event codes
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

/**
 * Generate a unique event code.
 * Keeps trying until a code that doesn't exist in DB is found.
 */
export const generateUniqueEventCode = async () => {
  let code;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    code = nanoid();
    exists = await Event.exists({ code });
    attempts++;
  }

  if (exists) {
    throw new Error('Could not generate a unique event code. Please try again.');
  }

  return code;
};
