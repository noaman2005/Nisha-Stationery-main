import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cartProducts, setCartProducts] = useState({});

    const addProduct = (productId) => {
        setCartProducts(prev => {
            const currentQuantity = prev[productId] || 0;
            return {
                ...prev,
                [productId]: currentQuantity + 1
            };
        });
    };

    const removeProduct = (productId) => {
        setCartProducts(prev => {
            const currentQuantity = prev[productId];
            if (currentQuantity <= 1) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [productId]: currentQuantity - 1
            };
        });
    };

    const clearCart = () => {
        setCartProducts({});
    };

    return (
        <CartContext.Provider value={{ cartProducts, addProduct, removeProduct, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
