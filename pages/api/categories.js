import {Category} from '@/models/Category';
import {Product} from '@/models/Product';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    await mongoose.connect(process.env.MONGODB_URI);

    try {
        const categories = await Category.find().lean(); // Fetch all categories including properties

        const categoriesWithProducts = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category: category._id }).lean(); // Fetch products for each category
                return { ...category, products };
            })
        );

        res.json({ categoriesWithProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error loading categories and products' });
    }
}
