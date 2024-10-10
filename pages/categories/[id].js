import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductBox from '@/components/ProductBox';
import Title from '@/components/Title';

export default function CategoryPage() {
    const router = useRouter();
    const { id } = router.query;
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!id) return;  // Wait for `id` to be available
        async function fetchCategory() {
            try {
                // Fetch category details
                const categoryRes = await axios.get(`/api/categories/${id}`);
                setCategory(categoryRes.data);

                // Fetch products for this category
                const productsRes = await axios.get(`/api/products?category=${id}`);
                setProducts(productsRes.data);
            } catch (error) {
                console.error("Error fetching category and products:", error);
            }
        }
        fetchCategory();
    }, [id]);

    if (!category) return <div>Loading category...</div>;

    return (
        <div className="p-8">
            <Title>{category.name}</Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductBox key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}
