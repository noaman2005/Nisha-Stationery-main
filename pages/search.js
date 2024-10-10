import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title"; // Assuming you have this component

const SearchWrapper = styled.div`
    padding: 20px;
`;


export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("query") || "";
        setSearchQuery(query);
        if (query) {
            fetchProducts(query);
        }
    }, []);

    const fetchProducts = async (query) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/products?search=${query}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SearchWrapper>
            <Title>Search Results for {searchQuery}</Title>
            {loading ? (
                <p>Loading...</p>
            ) : products.length > 0 ? (
                <ProductsGrid products={products} />
            ) : (
                <p>No products found</p>
            )}
        </SearchWrapper>
    );
}
