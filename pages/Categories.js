import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import Title from "@/components/Title";
import Button from "@/components/Button";
import Center from "@/components/Center";


// Styled Components
const PageWrapper = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const CategoryTitle = styled.h2`
    font-size: 1.6rem;
    margin: 40px 0 20px;
    font-weight: 400;
    text-align: left;
    color: #333;
`;

const ShowAllButtonWrapper = styled.div`
    text-align: left;
    margin-top: 15px;
`;

const FiltersWrapper = styled.div`
    margin-bottom: 20px;
`;

const Dropdown = styled.select`
    margin-right: 10px;
    padding: 5px;
    font-size: 1rem;
`;

export default function CategoriesPage() {
    const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState([]); // To track expanded categories
    const [selectedFilters, setSelectedFilters] = useState({}); // To track selected filters for each category
    const [filteredProducts, setFilteredProducts] = useState({}); // Store filtered products for each category

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await axios.get('/api/categories');
            setCategoriesWithProducts(data.categoriesWithProducts);
        }
        fetchCategories();
    }, []);

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prevExpandedCategories) =>
            prevExpandedCategories.includes(categoryId)
                ? prevExpandedCategories.filter(id => id !== categoryId) // Collapse the category
                : [...prevExpandedCategories, categoryId] // Expand the category
        );
    };

    const handleFilterChange = (categoryId, propertyName, value) => {
        const newSelectedFilters = {
            ...selectedFilters,
            [categoryId]: {
                ...selectedFilters[categoryId],
                [propertyName]: value
            }
        };
        setSelectedFilters(newSelectedFilters);
    };

    // Update filtered products whenever filters are changed
    useEffect(() => {
        categoriesWithProducts.forEach(category => {
            const filters = selectedFilters[category._id] || {};

            const filtered = category.products.filter(product => {
                return Object.entries(filters).every(([property, value]) =>
                    !value || product.properties?.[property] === value
                );
            });

            setFilteredProducts(prev => ({
                ...prev,
                [category._id]: filtered
            }));
        });
    }, [selectedFilters, categoriesWithProducts]);

    return (
        <>
            <Header />
            <Center>
                <PageWrapper>
                    <Title>Categories</Title>
                    {categoriesWithProducts.length > 0 ? (
                        categoriesWithProducts.map((category) => {
                            const isExpanded = expandedCategories.includes(category._id);
                            const filtered = filteredProducts[category._id] || category.products;

                            return (
                                <div key={category._id}>
                                    <CategoryTitle>{category.name}</CategoryTitle>

                                    {/* Filter Section */}
                                    {category.properties?.length > 0 && (
                                        <FiltersWrapper>
                                            {category.properties.map((property) => (
                                                <Dropdown
                                                    key={property.name}
                                                    onChange={(e) => handleFilterChange(category._id, property.name, e.target.value)}
                                                >
                                                    <option value="">Select {property.name}</option>
                                                    {property.values.map((value) => (
                                                        <option key={value} value={value}>
                                                            {value}
                                                        </option>
                                                    ))}
                                                </Dropdown>
                                            ))}
                                        </FiltersWrapper>
                                    )}

                                    {/* Products Grid */}
                                    {filtered.length > 0 ? (
                                        <>
                                            <ProductsGrid products={isExpanded ? filtered : filtered.slice(0, 4)} />
                                            <ShowAllButtonWrapper>
                                                <Button block black onClick={() => toggleCategory(category._id)}>
                                                    {isExpanded ? 'Show Less' : 'Show All Products'}
                                                </Button>
                                            </ShowAllButtonWrapper>
                                        </>
                                    ) : (
                                        <p>No products available for this category</p>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>Loading...</p>
                    )}
                </PageWrapper>
            </Center>
        </>
    );
}
