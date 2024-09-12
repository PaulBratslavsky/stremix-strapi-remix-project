import type { HeroSectionProps } from "~/lib/types";
import { Link } from "@remix-run/react";

export function HeroBlock({ data, user }: Readonly<HeroSectionProps>) {
  const { heading, subHeading, image, link } = data;

  const linkUrl = user.ok ? link.url : "/signin";

  return (
    <header className="relative h-[600px] overflow-hidden">
      <img
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full"
        height={1080}
        src={image.url}
        width={1920}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-20">
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
          {heading}
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl">{subHeading}</p>
        <Link
          className="mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100"
          to={linkUrl}
        >
          {user.ok ? "Go to Dashboard" : link.text}
        </Link>
        
      </div>
    </header>
  );
}
