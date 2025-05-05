
# SQL Instructions

To make this feature work correctly, you need to create a `receivable_accounts` table in your Supabase database. Here's the SQL code to create it:

```sql
-- Create receivable_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.receivable_accounts (
  id UUID PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  client_name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE,
  received_date DATE,
  received_amount NUMERIC,
  remaining_amount NUMERIC,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  category_id UUID NOT NULL,
  category_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  report_id UUID REFERENCES public.financial_reports(id) ON DELETE SET NULL
);

-- Add RLS policies
ALTER TABLE public.receivable_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to select data
CREATE POLICY "Users can view receivable accounts"
ON public.receivable_accounts 
FOR SELECT
TO authenticated
USING (true);

-- Create policy for authenticated users to insert data
CREATE POLICY "Users can create receivable accounts"
ON public.receivable_accounts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update data
CREATE POLICY "Users can update receivable accounts"
ON public.receivable_accounts
FOR UPDATE
TO authenticated
USING (true);

-- Create policy for authenticated users to delete data
CREATE POLICY "Users can delete receivable accounts"
ON public.receivable_accounts
FOR DELETE
TO authenticated
USING (true);
```

Please run this SQL in your Supabase SQL Editor to create the necessary table.
