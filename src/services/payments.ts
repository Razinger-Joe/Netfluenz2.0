import { Payment, Invoice, PricingPlan, MpesaPaymentRequest, Subscription } from '../types/payment';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

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
    private getLocalPayments(): Payment[] {
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

    private saveLocalPayments(payments: Payment[]): void {
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    }

    private getLocalSubscriptions(): Subscription[] {
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

    private saveLocalSubscriptions(subscriptions: Subscription[]): void {
        localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
    }

    async getPaymentsByUserId(userId: string): Promise<Payment[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((p: any) => ({
                    id: p.id,
                    userId: p.user_id,
                    amount: Number(p.amount),
                    currency: p.currency || 'KES',
                    method: p.payment_method || 'mpesa',
                    status: (p.status === 'completed' ? 'completed' : p.status === 'pending' ? 'processing' : 'failed') as any,
                    description: p.description || 'Payment',
                    reference: p.mpesa_receipt_number || p.mpesa_checkout_request_id || `REF-${p.id}`,
                    createdAt: new Date(p.created_at),
                    completedAt: p.status === 'completed' ? new Date(p.updated_at) : undefined,
                }));
            }
        }

        await delay(300);
        return this.getLocalPayments().filter(p => p.userId === userId);
    }

    async initiateMpesaPayment(request: MpesaPaymentRequest, userId: string): Promise<Payment> {
        if (isSupabaseConfigured() && supabase) {
            const checkoutId = `ws_CO_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
            const { data: inserted, error } = await (supabase.from('payments') as any)
                .insert([{
                    user_id: userId,
                    amount: request.amount,
                    currency: 'KES',
                    status: 'completed',
                    payment_method: 'mpesa',
                    mpesa_phone: request.phoneNumber,
                    mpesa_checkout_request_id: checkoutId,
                    description: request.transactionDescription,
                }])
                .select('*')
                .single();

            if (!error && inserted) {
                return {
                    id: inserted.id,
                    userId,
                    amount: Number(inserted.amount),
                    currency: 'KES',
                    method: 'mpesa',
                    status: 'completed',
                    description: request.transactionDescription,
                    reference: checkoutId,
                    createdAt: new Date(inserted.created_at),
                    completedAt: new Date(),
                };
            }
        }

        await delay(1000);
        const payments = this.getLocalPayments();
        const newPayment: Payment = {
            id: Math.random().toString(36).substring(7),
            userId,
            amount: request.amount,
            currency: 'KES',
            method: 'mpesa',
            status: 'completed',
            description: request.transactionDescription,
            reference: `MPESA-${Date.now()}`,
            createdAt: new Date(),
            completedAt: new Date(),
        };
        payments.push(newPayment);
        this.saveLocalPayments(payments);
        return newPayment;
    }

    async processCardPayment(
        userId: string,
        amount: number,
        description: string
    ): Promise<Payment> {
        return this.initiateMpesaPayment({
            phoneNumber: '254700000000',
            amount,
            accountReference: 'NETFLUENZ',
            transactionDescription: description,
        }, userId);
    }

    async subscribeToPlan(userId: string, planId: string): Promise<Subscription> {
        const plan = pricingPlans.find(p => p.id === planId);
        if (!plan) throw new Error('Plan not found');

        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);

        if (isSupabaseConfigured() && supabase) {
            const { data: inserted } = await (supabase.from('subscriptions') as any)
                .insert([{
                    user_id: userId,
                    plan_name: plan.id,
                    status: 'active',
                    amount: plan.price,
                }])
                .select('*')
                .single();

            if (inserted) {
                return {
                    id: inserted.id,
                    userId,
                    plan: plan.id as any,
                    status: 'active',
                    currentPeriodStart: now,
                    currentPeriodEnd: endDate,
                    cancelAtPeriodEnd: false,
                    createdAt: now,
                };
            }
        }

        await delay(800);
        const subscriptions = this.getLocalSubscriptions();
        const newSubscription: Subscription = {
            id: Math.random().toString(36).substring(7),
            userId,
            plan: plan.id as any,
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            cancelAtPeriodEnd: false,
            createdAt: now,
        };
        subscriptions.push(newSubscription);
        this.saveLocalSubscriptions(subscriptions);
        return newSubscription;
    }

    async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (!error && data) {
                return {
                    id: data.id,
                    userId: data.user_id,
                    plan: data.plan_name as any,
                    status: 'active',
                    currentPeriodStart: new Date(data.current_period_start || data.created_at),
                    currentPeriodEnd: new Date(data.current_period_end || Date.now() + 30 * 24 * 3600 * 1000),
                    cancelAtPeriodEnd: false,
                    createdAt: new Date(data.created_at),
                };
            }
        }

        await delay(300);
        return this.getLocalSubscriptions().find(s => s.userId === userId && s.status === 'active');
    }

    async generateInvoice(paymentId: string): Promise<Invoice> {
        await delay(500);
        const payments = this.getLocalPayments();
        const payment = payments.find(p => p.id === paymentId);
        const amount = payment?.amount || 5000;

        return {
            id: Math.random().toString(36).substring(7),
            paymentId,
            invoiceNumber: `INV-${Date.now()}`,
            userId: payment?.userId || 'user-1',
            userName: 'Netfluenz User',
            userEmail: 'user@example.com',
            items: [{ description: payment?.description || 'Campaign Services', quantity: 1, unitPrice: amount, total: amount }],
            subtotal: amount,
            tax: amount * 0.16,
            total: amount * 1.16,
            currency: 'KES',
            status: 'paid',
            dueDate: new Date(),
            createdAt: new Date(),
            paidAt: new Date(),
        };
    }

    getPricingPlans(): PricingPlan[] {
        return pricingPlans;
    }
}

export const paymentService = new PaymentService();
