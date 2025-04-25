"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId: string;
  onConfirmDelete: (quoteId: string) => void;
}

export default function DeleteQuoteModal({
  isOpen,
  onClose,
  quoteId,
  onConfirmDelete,
}: DeleteQuoteModalProps) {
  const handleDelete = () => {
    onConfirmDelete(quoteId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Quote
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this quote?</p>
              <p className="text-sm text-gray-500">Quote ID: {quoteId}</p>
              <p className="text-sm text-danger">
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
