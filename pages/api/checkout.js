import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST request.' });
    }

    try {
        const {
            name, email, city,
            postalCode, streetAddress, country,
            cartProducts,
        } = req.body;

        if (!cartProducts || Object.keys(cartProducts).length === 0) {
            return res.status(400).json({ error: 'No products in the cart' });
        }

        // Log cartProducts for debugging
        console.log('Cart Products:', cartProducts);

        // Ensure cartProducts is an object and get unique product IDs
        const uniqueIds = Object.keys(cartProducts);

        // Connect to the database
        await mongooseConnect();

        // Get product details
        const productsInfos = await Product.find({ _id: { $in: uniqueIds } });

        let line_items = [];

        for (const productId of uniqueIds) {
            const productInfo = productsInfos.find(p => p._id.toString() === productId);

            if (productInfo) {
                // Get quantity directly from cartProducts object
                const quantity = cartProducts[productId];

                if (quantity > 0) {
                    line_items.push({
                        quantity,
                        price_data: {
                            currency: 'INR',
                            product_data: { name: productInfo.title },
                            unit_amount: productInfo.price * 100,
                        },
                    });
                }
            }
        }

        if (line_items.length === 0) {
            return res.status(400).json({ error: 'No valid products found in the cart.' });
        }

        // Create an order in the database
        const orderDoc = await Order.create({
            line_items, name, email, city, postalCode, streetAddress, country, paid: false,
        });

        // Create a Stripe session
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: `http://localhost:3001/cart?success=1`,  // Change to http
            cancel_url: `http://localhost:3001/cart?canceled=1`,  // Change to http
            metadata: { orderId: orderDoc._id.toString() },
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error('Error during checkout process:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
