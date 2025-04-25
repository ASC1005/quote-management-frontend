"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface EditQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  onUpdate: (updatedQuote: any) => void;
}

export default function EditQuoteModal({
  isOpen,
  onClose,
  quote,
  onUpdate,
}: EditQuoteModalProps) {
  console.log("selectedQuote in edit page", quote);
  const [items, setItems] = useState([...quote.items]);

  useEffect(() => {
    setItems([...quote.items]);
  }, [quote]);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...items];
    const quantity = Math.max(0, newQuantity);

    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
    };

    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  };

  const handleSave = () => {
    const updatedQuote = {
      ...quote,
      items: items,
      total: calculateTotal(),
    };

    onUpdate(updatedQuote);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Quote
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Quote ID:</p>
                  <p className="font-medium">{quote._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Products:</p>
                  <ul className="space-y-4">
                    {items.map((item: any, index: number) => (
                      <li key={index} className="border-b pb-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-medium">
                            {item.product.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span>Quantity:</span>
                            <div className="flex items-center">
                              <Button
                                size="sm"
                                isIconOnly
                                variant="flat"
                                onPress={() =>
                                  handleQuantityChange(index, item.quantity - 1)
                                }
                              >
                                -
                              </Button>
                              <span className="mx-2 min-w-[30px] text-center">
                                {item.quantity.toString()}
                              </span>
                              <Button
                                size="sm"
                                isIconOnly
                                variant="flat"
                                onPress={() =>
                                  handleQuantityChange(index, item.quantity + 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-bold">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave}>
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
