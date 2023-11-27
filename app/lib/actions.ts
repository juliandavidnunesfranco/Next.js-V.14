// this pages is a server function that 
// execute actions only in the server .

'use server';
import {z} from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; // call the path and validate a new fetch
import { redirect } from 'next/navigation' // navigate to a new url
import {signIn} from '@/auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
    .number()
    .gt(0,{message: 'Please enter a amount greater than $0.'}),
    status: z.enum(['pending', 'paid'],{
      invalid_type_error: 'Please select an invoice status',
    }),
    date: z.string(),
  });
//omit the input that not is created in form.
 
const CreateInvoice = FormSchema.omit({id: true, date: true});


// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function createInvoice(prevState: State, formData: FormData) {
   
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    });
    //para extrar muchos input.value 
    // const data = Object.fromEntries(formData.entries());
    
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const [date] = new Date().toISOString().split('T');
    // const date = new Date().toISOString().split('T')[0]; origin style by next.js v14

    try {
      await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;  
    } catch (error) {
      return {
        message: 'Database Error: Error creating invoice',
      }
    }  

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  
  
  
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  } 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  
 try {
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 } catch (error) {
  return {
    message: 'Database Error: Error updating invoice',
 }
} 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice (id: string) {
  //throw new Error ('Failed to delete invoices')
try {
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
    `; 

    //revalidatePath('/dashboard/invoices');
    //return { message: 'Deleted Invoice' };
} catch (error) {
  return {
    message: 'Database Error: Error deleting invoice',
  }
}
  revalidatePath('/dashboard/invoices');
    //redirect('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'CredentialsSignin';
    }
    throw error;
  }
}