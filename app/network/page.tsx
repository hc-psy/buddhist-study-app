"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { SearchMenu } from "./components/search-menu";
import BookNetwork from "./components/book-network";
import UserNetwork from "./components/user_network";
import { BookType } from "@/types/book";

export default function NetworkPage() {
  const [focus, setFocus] = useState<number>(0);
  const [book, setBook] = useState<BookType>({
    original_topic: "",
  });

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between space-y-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Network</h2>
                <p className="text-sm text-muted-foreground my-2"></p>
              </div>
            </div>
            <div className="border-t">
              <div className="bg-background">
                <div className="grid grid-cols-3 lg:grid-cols-5">
                  <Sidebar
                    className="hidden lg:block"
                    focus={focus}
                    setFocus={setFocus}
                  />
                  <div className="col-span-3 lg:col-span-4 lg:border-l">
                    <div className="h-full px-4 py-6 lg:px-8">
                      {focus === 1 && (
                        <>
                          <div className="flex flex-row justify-between items-center">
                            <h3 className="text-xl font-bold tracking-tight">
                              {book.original_topic
                                ? book.original_topic
                                : "Please select a bibliographic record"}
                            </h3>
                            <SearchMenu setBook={setBook} />
                          </div>
                          <BookNetwork bookName={book.original_topic} />
                        </>
                      )}
                      {focus === 0 && <UserNetwork />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
