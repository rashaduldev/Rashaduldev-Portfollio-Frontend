type Testimonial = {
  image: string;
  name: string;
  username: string;
  quote: string;
  highlight: string;
};

type TranslationsType = {
  testimonialsSection: {
    testimonialHeading: string;
    trustedClients: string;
    testimonials: Testimonial[];
  };
};

export type LayoutContextType = {
  translations: TranslationsType;
  isRTL: boolean;
};
