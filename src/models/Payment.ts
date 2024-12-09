export interface Payment {
  _id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  currency: string;
  provider: 'stripe' | 'paystack' | 'flutterwave';
  status: 'pending' | 'success' | 'failed';
  reference: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentHistory {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}