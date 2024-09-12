import * as React from "react";
import { Link } from "@remix-run/react";
import { Atom, Menu, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

const LogoLink = {
  name: "Stremix",
  to: "/",
};

const navigation = [
  { name: "Transcripts", to: "dashboard/transcripts" },
  { name: "Notes", to: "dashboard/notes" },
  { name: "About", to: "about" },
];

export function TopNavigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="bg-background border-b border-border">
      <nav
        className="mx-auto flex items-center justify-between px-4 py-6"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            to={LogoLink.to}
            className="-m-1.5 p-1.5 flex items-center gap-x-2"
          >
            <Atom className="h-8 w-auto  text-pink-500" />

            <span className="text-2xl font-bold text-primary">
              {LogoLink.name}
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:max-w-none">
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild>
            <Link to="/login" className="text-sm font-semibold leading-6">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
