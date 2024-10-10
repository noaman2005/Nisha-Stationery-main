import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .8fr;
    }
    gap: 40px;
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img {
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        width: 100px;
        height: 100px;
        img {
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function CartPage() {
    const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (Object.keys(cartProducts).length > 0) {
            axios.post('/api/cart', { ids: Object.keys(cartProducts) })
                .then(response => {
                    setProducts(response.data);
                });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
    }, [clearCart]);

    function moreOfThisProduct(id) {
        addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    async function goToPayment() {
        if (!validateInputs()) {
            alert("Please enter valid information.");
            return;
        }

        const response = await axios.post('/api/checkout', {
            name, email, city, postalCode, streetAddress, country,
            cartProducts,
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
    }

    function validateInputs() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const postalCodeRegex = /^[0-9]*$/;
        return (
            name.trim() &&
            city.trim() &&
            streetAddress.trim() &&
            country.trim() &&
            emailRegex.test(email) &&
            postalCodeRegex.test(postalCode)
        );
    }


    let total = 0;
    for (const [productId, quantity] of Object.entries(cartProducts)) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price * quantity;
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thanks for your order!</h1>
                            <p>We will email you when your order will be sent.</p>
                        </Box>
                    </ColumnsWrapper>
                </Center>
            </>
        );
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Cart</h2>
                        {Object.keys(cartProducts).length === 0 ? (
                            <div>Your cart is empty</div>
                        ) : (
                            <Table>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map(product => {
                                    const quantity = cartProducts[product._id] || 0;
                                    return (
                                        <tr key={product._id}>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} alt="" />
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                                <QuantityLabel>
                                                    {quantity}
                                                </QuantityLabel>
                                                <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                            </td>
                                            <td>
                                                ₹{quantity * product.price}
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td> ₹{total}</td>
                                </tr>
                                </tbody>
                            </Table>
                        )}
                    </Box>
                    {Object.keys(cartProducts).length > 0 && (
                        <Box>
                            <h2>Order information</h2>
                            <Input type="text" placeholder="Name" value={name} onChange={ev => setName(ev.target.value)} />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={ev => setEmail(ev.target.value)}
                                required
                            />
                            <CityHolder>
                                <Input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={ev => setCity(ev.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="Postal Code"
                                    value={postalCode}
                                    onChange={ev => setPostalCode(ev.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </CityHolder>
                            <Input
                                type="text"
                                placeholder="Street Address"
                                value={streetAddress}
                                onChange={ev => setStreetAddress(ev.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={ev => setCountry(ev.target.value)}
                            />
                            <Button black block onClick={goToPayment}>
                                Continue to payment
                            </Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    );
}
