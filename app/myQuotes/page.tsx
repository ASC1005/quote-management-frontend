"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";
import ShowQuoteModal from "@/components/show-quote-modal";
import EditQuoteModal from "@/components/edit-quote-modal";
import DeleteQuoteModal from "@/components/delete-quote-modal";
import { Button } from "@heroui/button";
import { useAuth } from "@/context/auth-context";
import axios from "axios";

export default function QuotePage() {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const [quotes, setQuotes] = useState<any>();
  const getQuotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/quote`,
        {
          withCredentials: true,
        }
      );
      console.log("quote list", response.data);
      setQuotes(response.data.data);
    } catch (err) {
      alert("Failed to get quote list. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(isLoggedIn);
    if (isLoggedIn) getQuotes();
  }, [isLoggedIn]);

  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const {
    isOpen: isShowOpen,
    onOpen: onShowOpen,
    onClose: onShowClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleShowQuoteButton = (quote: any) => {
    setSelectedQuote(quote);
    onShowOpen();
  };

  const handleEditQuoteButton = (quote: any) => {
    setSelectedQuote(quote);
    onEditOpen();
  };

  const handleDeleteQuoteButton = (quote: any) => {
    setSelectedQuote(quote);
    onDeleteOpen();
  };

  const handleRequestQuote = async (quote: any) => {
    console.log(quote);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/quote/${quote._id}/request`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      alert("Quote Requested !!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error.message || "Login failed");
      } else {
        alert("An error occurred");
      }
    }
  };

  const handleUpdateQuote = async (updatedQuote: any) => {
    console.log(updatedQuote);
    const requestBody = { items: [...updatedQuote.items] };
    console.log(requestBody);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/quote/${updatedQuote._id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      getQuotes();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error.message || "Login failed");
      } else {
        alert("An error occurred");
      }
    }
    onEditClose();
  };

  const handleConfirmDelete = async (quoteId: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/quote/${quoteId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      getQuotes();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error.message || "Login failed");
      } else {
        alert("An error occurred");
      }
    }
    onDeleteClose();
  };

  return (
    <div>
      {isLoggedIn ? (
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">My Quotes</h1>

          {loading ? (
            <div>loading</div>
          ) : (
            <div className="container mx-auto px-4 py-8">
              <Table aria-label="Quotes table">
                <TableHeader>
                  <TableColumn>QUOTE ID</TableColumn>
                  <TableColumn>ESTIMATED AMOUNT</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {quotes?.map((quote: any, index: any) => (
                    <TableRow key={quote._id}>
                      <TableCell>Quote {quotes.length - index}</TableCell>
                      <TableCell>₹{quote.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            onPress={() => handleShowQuoteButton(quote)}
                          >
                            Show
                          </Button>
                          <Button
                            size="sm"
                            color="secondary"
                            onPress={() => handleEditQuoteButton(quote)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onPress={() => handleDeleteQuoteButton(quote)}
                          >
                            Delete
                          </Button>
                          <Button
                            size="sm"
                            color="success"
                            onPress={() => handleRequestQuote(quote)}
                          >
                            Request
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {selectedQuote && (
                <>
                  <ShowQuoteModal
                    isOpen={isShowOpen}
                    onClose={onShowClose}
                    quote={selectedQuote}
                  />

                  <EditQuoteModal
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    quote={selectedQuote}
                    onUpdate={handleUpdateQuote}
                  />

                  <DeleteQuoteModal
                    isOpen={isDeleteOpen}
                    onClose={onDeleteClose}
                    quoteId={selectedQuote._id}
                    onConfirmDelete={handleConfirmDelete}
                  />
                </>
              )}
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
