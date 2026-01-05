import { Payment, Invoice, PricingPlan, MpesaPaymentRequest, Subscription } from '../types/payment';

const PAYMENTS_KEY = 'netfluenz_payments';
const SUBSCRIPTIONS_KEY = 'netfluenz_subscriptions';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const pricingPlans: PricingPlan[] = [
    {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started',
        price: 0,
        currency: 'KES',
        interval: 'monthly',
        features: [
            'Browse influencers',
            'Basic search filters',
            '1 active campaign',
            'Email support',
        ],
        limits: {
            campaigns: 1,
            influencers: 5,
            messages: 10,
            analytics: false,
            support: 'email',
        },
    },
    {
        id: 'starter',
        name: 'Starter',
        description: 'For growing brands',
        price: 4999,
        currency: 'KES',
        interval: 'monthly',
        features: [
            'Everything in Free',
            'Advanced search filters',
            '5 active campaigns',
            'Basic analytics',
            'Unlimited messages',
            'Priority support',
        ],
        limits: {
            campaigns: 5,
            influencers: 25,
            messages: -1,
            analytics: true,
            support: 'priority',
        },
        popular: true,
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'For established brands',
        price: 14999,
        currency: 'KES',
        interval: 'monthly',
        features: [
            'Everything in Starter',
            'Unlimited campaigns',
            'Advanced analytics & ROI tracking',
            'Custom reports',
            'API access',
            'Dedicated account manager',
        ],
        limits: {
            campaigns: -1,
            influencers: -1,
            messages: -1,
            analytics: true,
            support: 'dedicated',
        },
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations',
        price: 49999,
        currency: 'KES',
        interval: 'monthly',
        features: [
            'Everything in Professional',
            'White-label options',
            'Custom integrations',
            'SLA guarantee',
            'On-premise deployment option',
            '24/7 phone support',
        ],
        limits: {
            campaigns: -1,
            influencers: -1,
            messages: -1,
            analytics: true,
            support: 'dedicated',
        },
    },
];

class PaymentService {
    private getPayments(): Payment[] {
        try {
            const stored = localStorage.getItem(PAYMENTS_KEY);
            if (stored) {
                return JSON.parse(stored).map((p: Payment) => ({
                    ...p,
                    createdAt: new Date(p.createdAt),
                    completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
                }));
            }
            return [];
        } catch {
            return [];
        }
    }

    private savePayments(payments: Payment[]): void {
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    }

    private getSubscriptions(): Subscription[] {
        try {
            const stored = localStorage.getItem(SUBSCRIPTIONS_KEY);
            if (stored) {
                return JSON.parse(stored).map((s: Subscription) => ({
                    ...s,
                    currentPeriodStart: new Date(s.currentPeriodStart),
                    currentPeriodEnd: new Date(s.currentPeriodEnd),
                    createdAt: new Date(s.createdAt),
                }));
            }
            return [];
        } catch {
            return [];
        }
    }

    private saveSubscriptions(subscriptions: Subscription[]): void {
        localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
    }

    async getPaymentsByUserId(userId: string): Promise<Payment[]> {
        await delay(400);
        return this.getPayments().filter(p => p.userId === userId);
    }

    async initiateMpesaPayment(request: MpesaPaymentRequest, userId: string): Promise<Payment> {
        await delay(1500); // Simulate STK push delay

        const payments = this.getPayments();
        const newPayment: Payment = {
            id: Math.random().toString(36).substring(7),
            userId,
            amount: request.amount,
            currency: 'KES',
            method: 'mpesa',
            status: 'processing',
            description: request.transactionDescription,
            reference: `MPESA-${Date.now()}`,
            createdAt: new Date(),
            metadata: {
                phoneNumber: request.phoneNumber,
                accountReference: request.accountReference,
            },
        };
        payments.push(newPayment);
        this.savePayments(payments);

        // Simulate payment completion after delay
        setTimeout(() => {
            const updatedPayments = this.getPayments();
            const index = updatedPayments.findIndex(p => p.id === newPayment.id);
            if (index !== -1) {
                updatedPayments[index].status = 'completed';
                updatedPayments[index].completedAt = new Date();
                this.savePayments(updatedPayments);
            }
        }, 5000);

        return newPayment;
    }

    async processCardPayment(
        userId: string,
        amount: number,
        description: string
    ): Promise<Payment> {
        await delay(2000);

        const payments = this.getPayments();
        const newPayment: Payment = {
            id: Math.random().toString(36).substring(7),
            userId,
            amount,
            currency: 'KES',
            method: 'card',
            status: 'completed',
            description,
            reference: `CARD-${Date.now()}`,
            createdAt: new Date(),
            completedAt: new Date(),
        };
        payments.push(newPayment);
        this.savePayments(payments);
        return newPayment;
    }

    async subscribeToPlan(userId: string, planId: string): Promise<Subscription> {
        await delay(1000);

        const subscriptions = this.getSubscriptions();
        const plan = pricingPlans.find(p => p.id === planId);
        if (!plan) throw new Error('Plan not found');

        // Cancel existing subscription
        const existingIndex = subscriptions.findIndex(s => s.userId === userId && s.status === 'active');
        if (existingIndex !== -1) {
            subscriptions[existingIndex].status = 'cancelled';
        }

        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);

        const newSubscription: Subscription = {
            id: Math.random().toString(36).substring(7),
            userId,
            plan: plan.id,
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            cancelAtPeriodEnd: false,
            createdAt: now,
        };
        subscriptions.push(newSubscription);
        this.saveSubscriptions(subscriptions);
        return newSubscription;
    }

    async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
        await delay(300);
        return this.getSubscriptions().find(s => s.userId === userId && s.status === 'active');
    }

    async generateInvoice(paymentId: string): Promise<Invoice> {
        await delay(500);
        const payments = this.getPayments();
        const payment = payments.find(p => p.id === paymentId);
        if (!payment) throw new Error('Payment not found');

        return {
            id: Math.random().toString(36).substring(7),
            paymentId,
            invoiceNumber: `INV-${Date.now()}`,
            userId: payment.userId,
            userName: 'User Name', // Would come from user service
            userEmail: 'user@example.com',
            items: [{ description: payment.description, quantity: 1, unitPrice: payment.amount, total: payment.amount }],
            subtotal: payment.amount,
            tax: payment.amount * 0.16, // 16% VAT
            total: payment.amount * 1.16,
            currency: payment.currency,
            status: 'paid',
            dueDate: new Date(),
            createdAt: new Date(),
            paidAt: payment.completedAt,
        };
    }

    getPricingPlans(): PricingPlan[] {
        return pricingPlans;
    }
}

export const paymentService = new PaymentService();
