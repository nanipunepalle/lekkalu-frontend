import { z } from 'zod'

export const userProfileSchema = z.object({
  first_name: z.string().min(3, 'Please enter at least 3 characters!').max(20, 'Please enter at most 20 characters!'),
  last_name: z.string().min(3, 'Please enter at least 3 characters!').max(20, 'Please enter at most 20 characters!'),
  email: z.string().email('Invalid Email!'),
})

export const changePasswordSchema = z
  .object({
    current_password: z.string(),
    new_password: z
      .string()
      .min(8, 'Please enter at least 8 characters')
      .max(20, 'Please enter at most 20 characters!'),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Password does not match',
    path: ['confirm_password'],
  })
