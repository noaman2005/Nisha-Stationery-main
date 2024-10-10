import Link from 'next/link';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
    background-color: #222;
    color: #fff;
    padding: 40px 20px;
    text-align: center;
    margin-top: 50px; /* Add margin above the footer */
`;

const FooterLinks = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    flex-wrap: wrap;

    a {
        margin: 0 15px;
        color: #fff;
        font-size: 16px;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: #1da1f2;
        }
    }
`;

const Copyright = styled.p`
    font-size: 14px;
    margin-top: 30px;
    opacity: 0.7;
`;

export default function Footer() {
    return (
        <FooterWrapper>
            <FooterLinks>
                <Link href="/">Home</Link>
                <Link href="https://maps.app.goo.gl/vduSssxaDLvEJvnn6">About Us</Link>
                <Link href="https://wa.me/9987497767" target="_blank" rel="noopener noreferrer">
                    Contact Us
                </Link>
                <Link href="https://www.lclark.edu/offices/communications/order-and-download/stationery-faq/">FAQs</Link>
                <Link href="/">Privacy Policy</Link>
            </FooterLinks>

            <Copyright>&copy; {new Date().getFullYear()} Nisha Stationery<br />
                All Rights Reserved</Copyright>
        </FooterWrapper>
    );
}
