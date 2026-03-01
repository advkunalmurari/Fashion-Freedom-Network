
import React, { useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2 } from 'lucide-react';

interface PayPalButtonProps {
    amount: string;
    currency?: string;
    onSuccess: (details: any) => void;
    onError?: (error: any) => void;
    type?: 'capture' | 'subscription';
    planId?: string; // Required for subscriptions
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({
    amount,
    currency = "USD",
    onSuccess,
    onError,
    type = 'capture',
    planId
}) => {
    const [{ isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "setLoadingStatus",
            value: "pending"
        });
    }, [dispatch]);
    const handleCreateOrder = (data: any, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: amount,
                        currency_code: currency
                    },
                },
            ],
        });
    };

    const handleApprove = async (data: any, actions: any) => {
        if (type === 'capture') {
            // Do NOT capture the order on the client-side. The backend handles this.
            // If the client captures it, the backend will fail to capture & log it due to ORDER_ALREADY_CAPTURED.
            onSuccess({ id: data.orderID, ...data });
        } else {
            // For subscriptions, approval means the subscription is created
            onSuccess(data);
        }
    };

    const handleCreateSubscription = (data: any, actions: any) => {
        if (!planId) {
            console.error("Plan ID is required for subscriptions");
            return Promise.reject("Plan ID missing");
        }
        return actions.subscription.create({
            plan_id: planId
        });
    };

    return (
        <div className="relative w-full">
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-2xl">
                    <Loader2 className="w-8 h-8 animate-spin text-ffn-primary" />
                </div>
            )}
            <PayPalButtons
                style={{
                    layout: "vertical",
                    shape: "pill",
                    color: "black",
                    label: type === 'subscription' ? 'subscribe' : 'pay',
                    height: 55
                }}
                createOrder={type === 'capture' ? handleCreateOrder : undefined}
                createSubscription={type === 'subscription' ? handleCreateSubscription : undefined}
                onApprove={handleApprove}
                onError={(err) => {
                    console.error("PayPal Error:", err);
                    if (onError) onError(err);
                }}
            />
        </div>
    );
};
