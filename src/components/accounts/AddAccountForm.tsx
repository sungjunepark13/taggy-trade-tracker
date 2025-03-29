
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { useBrokerageAccounts } from '@/context/BrokerageAccountsContext';

const formSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  broker: z.string().min(1, 'Broker name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountType: z.string().min(1, 'Account type is required'),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ open, onOpenChange }) => {
  const { addAccount } = useBrokerageAccounts();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      broker: '',
      accountNumber: '',
      accountType: '',
      color: '#3498db',
    },
  });

  const onSubmit = (data: FormValues) => {
    // All fields from the form are required (enforced by zod validation)
    // We just need to ensure color has a value, even if it's the default
    const accountData = {
      name: data.name,
      broker: data.broker,
      accountNumber: data.accountNumber,
      accountType: data.accountType,
      color: data.color || '#3498db',
    };
    
    addAccount(accountData);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Brokerage Account</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Trading Account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="broker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker</FormLabel>
                  <FormControl>
                    <Input placeholder="Interactive Brokers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Cash, Margin, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: field.value || '#3498db' }} />
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="submit">Add Account</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountForm;
