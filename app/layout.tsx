import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import Head from "next/head";
//import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

type TemplateString = {
  template: string;
  default: string;
};

export const metadata: Metadata & { title: TemplateString } = {
  title: {
    template: "%s | Acme Dashboard",
    default: "Acme Dashboard",
  },
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

const RootLayout: React.FC<LayoutProps> = ({
  children,
  title,
}: LayoutProps) => {
  const pageTitle = title
    ? `${title} | Acme Dashboard`
    : metadata.title.default;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </>
  );
};

export default RootLayout; 
/* 
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  context: any;
}

type TemplateString = {
  template: string;
  default: string;
};

export const metadata: Metadata & { title: TemplateString } = {
  title: {
    template: "%s | Acme Dashboard",
    default: "Acme Dashboard",
  },
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout({ children, context }: LayoutProps) {
  //const router = useRouter();
  const pathname = context.pathname; //router.pathname;
  const pageTitle =
    pathname !== "/"
      ? `${pathname.slice(1)} | Acme Dashboard`
      : metadata.title.default;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </>
  );
}

//export default RootLayout;
 */