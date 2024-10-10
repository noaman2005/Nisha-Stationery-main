import Link from "next/link";
import styled, { keyframes } from "styled-components";
import Center from "@/components/Center";
import { useContext, useState, useRef, useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";

// Keyframe animation for bouncing effect
const cartBounce = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
`;

const StyledHeader = styled.header`
    background-color: #222;
    position: relative;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: larger;
    position: relative;
    z-index: 3;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    ${props => props.mobilenavActive ? `
    display: block;
  ` : `
    display: none;
  `}
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration: none;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`;

const NavButton = styled.button`
    background-color: transparent;
    width: 30px;
    height: 30px;
    border: 0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

// Update CartIcon to use animation
const CartIcon = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    background: url('/cart-icon.svg') no-repeat center center;
    background-size: contain;
    animation: ${({ isBouncing }) => isBouncing ? cartBounce : 'none'} 0.5s ease;
`;

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    const [mobilenavActive, setMobilenavActive] = useState(false);
    const [cartBounce, setCartBounce] = useState(false);
    const cartItemCount = Object.values(cartProducts).reduce((acc, quantity) => acc + quantity, 0);

    // Trigger bounce animation when cartProducts are updated
    useEffect(() => {
        if (cartItemCount > 0) {
            setCartBounce(true);
            setTimeout(() => setCartBounce(false), 500); // Reset after bounce animation
        }
    }, [cartItemCount]);

    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>Nisha Stationery</Logo>
                    <StyledNav mobilenavActive={mobilenavActive}>
                        <NavLink href={'/'}>Home</NavLink>
                        <NavLink href={'/products'}>All products</NavLink>
                        <NavLink href={'/Categories'}>Categories</NavLink>
                        <NavLink href={'/Account'}>Account</NavLink>
                        <NavLink href={'/cart'}>Cart ({cartItemCount})</NavLink>
                    </StyledNav>
                    <NavButton onClick={() => setMobilenavActive(prev => !prev)}>
                        <BarsIcon />
                    </NavButton>
                    <CartIcon isBouncing={cartBounce} />
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}
