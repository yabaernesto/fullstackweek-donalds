"use client";

import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

export interface CartProduct extends Pick<Product, "id" | "name" | "imageUrl" | "price"> {
  quantity: number;
};

export interface ICartContext {
  isOpen: boolean;
  products: CartProduct[];
  toggleCart: () => void;
  addProduct: (product: CartProduct) => void;
};

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleCart = () => {
    setIsOpen(prev => !prev)
  };

  const addProduct = (product: CartProduct) => {
    // verificar se o produto ja esta no carrinho
    // se estiver, aumente a sua quantidade
    // se nao estiver, o adicone
    const productIsAlreadyOnTheCart = products.some(prevProduct => {
      return prevProduct.id === product.id;
    });

    if (!productIsAlreadyOnTheCart) {
      return setProducts(prev => [...prev, product]);
    }

    setProducts(prevProducts => {
      return prevProducts.map(prevProduct => {
        if (prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity,
          };
        }

        return product;
      });
    });
  };

  return (
    <CartContext.Provider
      value={{ 
        isOpen,
        products,
        toggleCart,
        addProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
