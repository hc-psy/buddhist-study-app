import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

type props = {
  className?: string;
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
};

export function Sidebar({ className = "", focus, setFocus }: props) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant={focus === 0 ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setFocus(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              User
            </Button>
            <Button
              variant={focus === 1 ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setFocus(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Bibliography
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
