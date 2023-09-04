import { Metadata } from "next";
export const metadata: Metadata = {
  title: "BuddhiLab: User Study of Digital Library of Buddhist Studies",
  description: "",
};

export default function NetworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
