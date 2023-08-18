import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default function PatternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
