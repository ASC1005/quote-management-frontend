"use client";

import { useEffect, useState } from "react";
import { Card, CardFooter, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { useAuth } from "@/context/auth-context";
import axios from "axios";

type CartItem = {
  product: string;
  quantity: number;
};

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  const { isLoggedIn } = useAuth();
  const [productsList, setProductsList] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  console.log(cart);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/product/all`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setProductsList(response.data.data);
    } catch (err) {
      alert("Failed to load products. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(isLoggedIn);
    if (isLoggedIn) getProducts();
  }, [isLoggedIn]);

  const addToCart = (product: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product === product);

      if (existingItem) {
        return prevCart.map((item) =>
          item.product === product
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (product: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product === product);

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.product === product
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => item.product !== product);
      }
    });
  };

  const getQuantity = (product: string) => {
    const item = cart.find((item) => item.product === product);
    return item ? item.quantity : 0;
  };

  const handleCreateQuote = async () => {
    try {
      const responseBody = { items: [...cart] };
      console.log(cart);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/quote/create`,
        responseBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(response.data);
      alert("Quote created successfully!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error.message || "Login failed");
      } else {
        alert("An error occurred");
      }
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <main className="container flex flex-col mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
          <Button
            onPress={handleCreateQuote}
            color="primary"
            className="my-4 ml-auto mr-4"
          >
            Create Quote
          </Button>
          {loading ? (
            <div>loading</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList?.map((product: any) => (
                <Card key={product._id} className="p-4">
                  <CardBody className="overflow-visible p-0">
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      alt={product.name}
                      className="w-full object-cover h-[240px]"
                      src={product.image || "/placeholder.svg"}
                    />
                  </CardBody>
                  <CardFooter className="flex flex-col items-start text-left">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-lg font-semibold text-default-500">
                      ₹{product.price.toLocaleString()}{" "}
                      <span className="text-xs">(Estimated)</span>
                    </p>
                    <p className="text-sm text-default-500 mt-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        color="danger"
                        variant="flat"
                        isDisabled={getQuantity(product._id) === 0}
                        onPress={() => removeFromCart(product._id)}
                      >
                        -
                      </Button>
                      <span className="mx-2 min-w-[30px] text-center">
                        {getQuantity(product._id)}
                      </span>
                      <Button
                        color="primary"
                        onPress={() => addToCart(product._id)}
                      >
                        +
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      ) : (
        <div className="mx-auto py-40 w-full flex justify-center items-center">
          <div className="p-4 text-lg rounded-md bg-zinc-900">
            {" "}
            Please login to view our products{" "}
          </div>
        </div>
      )}
    </div>
  );
}
