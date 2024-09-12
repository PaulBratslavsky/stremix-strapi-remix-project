import type { LinksFunction } from "@remix-run/node";
import { Toaster } from "react-hot-toast";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";

import { TopNavigation } from "~/components/custom/top-navigation";
import faviconAssetURL from "./assets/favicon.ico";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: faviconAssetURL },
];

export function Layout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <TopNavigation />
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
