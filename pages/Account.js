import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "@/components/Header"; // Import your header
import axios from "axios";
import Center from "@/components/Center";

// Styled components
const Container = styled.div`
    padding: 20px;
    background-color: #f9f9f9;
    min-height: calc(100vh - 60px); /* Adjust height based on your header */
`;

const Title = styled.h2`
    margin-bottom: 10px;
    font-size: 1.75rem; /* Increased font size */
    color: #333;
    text-align: center; /* Center title */
`;

const Button = styled.button`
    background-color: #eee;
    color: black;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 20px;
    display: block; /* Center button */
    margin-left: auto;
    margin-right: auto;

    &:hover {
        background-color: #005bb5;
        color: white; /* Change text color on hover for better visibility */
    }
`;

const WelcomeMessage = styled.p`
    font-size: 1.2rem;
    color: #555;
    text-align: center; /* Center message */
`;

const Section = styled.div`
    margin-top: 20px;
    padding: 15px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const UserDetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns */
    gap: 10px; /* Space between items */
`;

const UserDetailItem = styled.div`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Account = () => {
    const { data: session } = useSession(); // Destructure session from useSession hook
    const [profilePic, setProfilePic] = useState("");
    const [lastLogin, setLastLogin] = useState("");

    useEffect(() => {
        if (session) {
            // Fetch user details including last login info
            const fetchUserDetails = async () => {
                try {
                    const response = await axios.get(`/api/user/${session.user.id}`);
                    setLastLogin(response.data.lastLogin);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };
            fetchUserDetails();
        }
    }, [session]);


    return (
        <>
            <Header />
            <Center>
            <Container>
                <Title>Account</Title>
                {session ? (
                    <>
                        <WelcomeMessage>Welcome, {session.user.name}!</WelcomeMessage>

                        {/* User Details Section */}
                        <UserDetailsGrid>
                            <UserDetailItem>
                                <strong>Username:</strong> {session.user.name}
                            </UserDetailItem>
                            <UserDetailItem>
                                <strong>Email:</strong> {session.user.email}
                            </UserDetailItem>
                            <UserDetailItem>
                                <strong>Last Login:</strong> {lastLogin || "N/A"}
                            </UserDetailItem>
                            <UserDetailItem>
                                <strong>User Icon:</strong>
                                <img src={session.user.image} alt="User Icon" width={50}/>
                            </UserDetailItem>
                        </UserDetailsGrid>

                        {/* Logout Button */}
                        <Button onClick={() => signOut()}>Sign Out</Button>
                    </>
                ) : (
                    <Button onClick={() => signIn()}>Sign In</Button>
                )}
            </Container>
            </Center>
        </>
    );
};

export default Account;
