import { Product } from '@/models/Product';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    await mongoose.connect(process.env.MONGODB_URI);

    const { category, search } = req.query; // Capture both category and search query

    let products = [];

    // If a search query is provided, perform a search by title
    if (search) {
        const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
        products = await Product.find({
            title: { $regex: searchRegex }, // Search by product title
        });
    }
    // If a category is provided (but no search), fetch by category
    else if (category) {
        products = await Product.find({ category });
    }
    // If no search or category is provided, return all products
    else {
        products = await Product.find();
    }

    res.json(products);
}
