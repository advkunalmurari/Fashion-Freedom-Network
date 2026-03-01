const paymentService = require('./payments/paymentService');

async function testPayPal() {
    try {
        console.log("Testing PayPal Live Check...");
        console.log("Environment:", process.env.PAYPAL_MODE);
        const order = await paymentService.createOrder("1.00", "USD");
        console.log("Success! PayPal Order Created:");
        console.log(JSON.stringify(order));
    } catch (e) {
        console.error("PayPal Error:", e);
    }
}

testPayPal();
