export interface ImageProps {
  id: number;
  url: string;
  alternativeText: string;
}

export interface LinkProps {
  id: number;
  url: string;
  text: string;

}

export interface User {
  id: number;
  username: string;
  email: string;
  ok: boolean;
}


interface FeatureProps {
  id: number;
  heading: string;
  subHeading: string;
  icon: string;
}

export interface FeaturesBlockProps {
  id: number;
  __component: string;
  title: string;
  description: string;
  feature: FeatureProps[];
}

export interface HeroSectionProps {
  data: {
    id: number;
    __component: string;
    heading: string;
    subHeading: string;
    image: ImageProps;
    link: LinkProps;
  };
  user: User;
}