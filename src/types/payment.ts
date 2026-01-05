export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer';
export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: 'KES' | 'USD';
    method: PaymentMethod;
    status: PaymentStatus;
    description: string;
    reference: string;
    campaignId?: string;
    createdAt: Date;
    completedAt?: Date;
    metadata?: Record<string, unknown>;
}

export interface Invoice {
    id: string;
    paymentId: string;
    invoiceNumber: string;
    userId: string;
    userName: string;
    userEmail: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    currency: 'KES' | 'USD';
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    dueDate: Date;
    createdAt: Date;
    paidAt?: Date;
}

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface PricingPlan {
    id: SubscriptionPlan;
    name: string;
    description: string;
    price: number;
    currency: 'KES' | 'USD';
    interval: 'monthly' | 'yearly';
    features: string[];
    limits: {
        campaigns: number;
        influencers: number;
        messages: number;
        analytics: boolean;
        support: 'email' | 'priority' | 'dedicated';
    };
    popular?: boolean;
}

export interface MpesaPaymentRequest {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDescription: string;
}

export interface Subscription {
    id: string;
    userId: string;
    plan: SubscriptionPlan;
    status: 'active' | 'cancelled' | 'expired' | 'past_due';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
}
