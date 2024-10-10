import styled, { keyframes } from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";

// Keyframe animation for scaling effect
const scaleUp = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const ProductWrapper = styled.div`
    background-color: #fff;
    padding: 8px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    min-height: 200px; /* Ensures consistent height for all product boxes */
    animation: ${({ isScaled }) => isScaled ? scaleUp : 'none'} 0.5s ease;
`;

const WhiteBox = styled(Link)`
    display: block;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 10px;

    img {
        width: 100%;
        height: 100%;
        margin: 10px 0;
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: 1rem;
    color: #333;
    text-decoration: none;
    margin: 10px 0;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: block;
    @media screen and (min-width: 768px) {
        display: flex;
        gap: 5px;
    }
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 400;
    text-align: right;
    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
        font-weight: 600;
        text-align: left;
    }
`;

export default function ProductBox({ _id, title, description, price, images }) {
    const { addProduct } = useContext(CartContext);
    const [isScaled, setIsScaled] = useState(false);
    const url = '/product/'+_id;

    const handleAddToCart = () => {
        setIsScaled(true);
        setTimeout(() => setIsScaled(false), 500); // Reset animation after it completes
        addProduct(_id);
    };

    return (
        <ProductWrapper isScaled={isScaled}>
            <WhiteBox href={url}>
                <div>
                    {images?.[0] ? (
                        <img src={images[0]} alt={title} />
                    ) : (
                        <img src="/placeholder.png" alt="placeholder" />
                    )}
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>₹{price}</Price>
                    <Button block onClick={handleAddToCart} primary outline>
                        Add to cart
                    </Button>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    );
}
