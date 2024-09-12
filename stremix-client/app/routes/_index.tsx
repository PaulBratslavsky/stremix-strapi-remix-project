// React and Remix
import type { MetaFunction } from "@remix-run/node";

// Components
import { HeroBlock } from "~/components/blocks/hero-block";
import { FeaturesBlock } from "~/components/blocks/features-block";

// Page meta data
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// Remix Route
export default function HomeRoute() {
  return (
    <div>
      <HeroBlock data={mockData.data} user={mockUser} />
      <FeaturesBlock data={featuresMockData} />
    </div>
  );
}

const mockUser = {
  id: 1,
  username: "test",
  email: "test@test.com",
  ok: true,
};

const mockData = {
  data: {
    id: 1,
    __component: "hero",
    heading: "Welcome to the Stremix",
    subHeading:
      "Video summarization note taking app built with Remix and Strapi",
    image: {
      id: 1,
      url: "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress",
      alternativeText: "Test",
    },
    link: {
      id: 1,
      url: "/dashboard",
      text: "Dashboard",
    },
  },
  user: mockUser,
};

const featuresMockData = {
  id: 1,
  __component: "features-block",
  title: "Features",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  feature: [
    {
      id: 1,
      heading: "Feature 1",
      subHeading: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: "CLOCK_ICON",
    },
    {
      id: 2,
      heading: "Feature 2",
      subHeading: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: "CHECK_ICON",
    },
    {
      id: 3,
      heading: "Feature 3",
      subHeading: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: "CLOUD_ICON",
    },
  ],
};
