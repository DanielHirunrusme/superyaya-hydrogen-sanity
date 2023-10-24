import {type VariantsConfigOf, styled} from 'react-tailwind-variants';

export const Typography = styled('div', {
  variants: {
    type: {
      body: '',
      index:
        'text-indexMobile md:text-indexTablet xl:text-indexLaptop 2xl:text-indexDesktop font-index',
      rte: 'text-rteMobile md:text-rteTablet xl:text-rteLaptop 2xl:text-rteDesktop font-serif',
    },
    size: {
      sm: 'text-sm',
    },
  },
  compoundVariants: [
    {
      variants: {
        type: 'body',
        size: 'sm',
      },
      className: '2xl:text-utilityDesktop xl:text-utilityLaptop md:text-utilityTablet text-utilityMobile',
    },
  ],
});

type TypographyVariantsConfig = VariantsConfigOf<typeof Typography>;
