import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell me your name.").max(100, "That name is a bit long."),
  email: z.string().trim().email("That email address doesn't look right.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "A few more words, please (at least 10 characters).")
    .max(3000, "Please keep the message under 3000 characters."),
  /** Honeypot: hidden from people, so only bots fill it in. */
  website: z.string().max(0).optional(),
  /** Timestamp (ms) of when the form was shown, to catch instant bot submissions. */
  startedAt: z.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
