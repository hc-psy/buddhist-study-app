import "./globals.css";
import type { Metadata } from "next";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/providers";
import { ExamplesNav } from "@/components/examples-nav";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

import { Providers } from "@/features/providers";

export const metadata: Metadata = {
  title: "BuddhiLab: User Study of Digital Library of Buddhist Studies",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">
                <div className="container relative">
                  <PageHeader className="pb-8">
                    <PageHeaderHeading>
                      User Studies of the NTU Digital Library of Buddhist
                      Studies
                    </PageHeaderHeading>
                    <PageHeaderDescription>
                      Analyze, understand, and connect with user behaviors in
                      the NTU Digital Library of Buddhist Studies (DLBS) with
                      AI-powered technologies, sourced from a DLBS dataset of 8
                      million browsing logs from March to September 2022.
                      Interactive. Customizable. Enlightening.
                    </PageHeaderDescription>
                  </PageHeader>
                  <ExamplesNav />
                  <section className="hidden md:block">
                    <div className="overflow-hidden rounded-lg border bg-background shadow">
                      {children}
                    </div>
                  </section>
                </div>
              </div>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
