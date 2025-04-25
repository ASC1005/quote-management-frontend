"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import { Button } from "@heroui/button"

interface ShowQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  quote: any
}

export default function ShowQuoteModal({ isOpen, onClose, quote }: ShowQuoteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Quote Details</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Quote ID:</p>
                  <p className="font-medium">{quote._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Products:</p>
                  <ul className="space-y-2 mt-2">
                    {quote.items.map((item: any, index: number) => (
                      <li key={index} className="border-b pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.product.name}</span>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-bold">₹{quote.total.toLocaleString()}</span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
