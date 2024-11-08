import {type VariantsConfigOf, styled} from 'react-tailwind-variants';

export const Typography = styled('div', {
  variants: {
    type: {
      body: '',
      index:
        'text-indexMobile md:text-indexTablet xl:text-indexLaptop 2xl:text-indexDesktop font-index',
      rte: 'text-rteMobile md:text-rteTablet xl:text-rteLaptop 2xl:text-rteDesktop font-serif',
      collection: 'text-collectionMobile md:text-collectionTablet xl:text-collectionLaptop 2xl:text-collectionDesktop font-cursive !normal-case',
      radio:
        'font-radio text-radioMobile md:text-radioTablet xl:text-radioLaptop 2xl:text-radioDesktop',
      radioPlayer:
        'font-radio text-radioPlayerMobile md:text-radioPlayerTablet xl:text-radioPlayerLaptop 2xl:text-radioPlayerDesktop',
    },
    size: {
      sm: 'text-sm',
      md: 'text-md'
    },
  },
  compoundVariants: [
    {
      variants: {
        type: 'body',
        size: 'sm',
      },
      className:
        '2xl:text-utilityDesktop xl:text-utilityLaptop md:text-utilityTablet text-utilityMobile',
    },
  ],
});

type TypographyVariantsConfig = VariantsConfigOf<typeof Typography>;
