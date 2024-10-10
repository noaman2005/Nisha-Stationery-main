import Header from "@/components/Header";
import Center from "@/components/Center";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import styled from "styled-components";
import { useState } from "react";
import { FaSearch } from 'react-icons/fa'; // Import the search icon

const SearchWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;
    padding: 0;
`;

const SearchIcon = styled(FaSearch)`
    margin-right: 10px;
    font-size: 1.2rem;
    color: #666;
`;

const SearchInput = styled.input`
    padding: 10px;
    width: 300px;
    max-width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export default function ProductsPage({ products }) {
    const [filter, setFilter] = useState('');

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <>
            <Header />
            <Center>
                <Title>All products</Title>
                <SearchWrapper>
                    <SearchIcon />
                    <SearchInput
                        type="text"
                        placeholder="Search products..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </SearchWrapper>
                <ProductsGrid products={filteredProducts} />
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { '_id': -1 } });
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        }
    };
}
