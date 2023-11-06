import {type VariantsConfigOf, styled} from 'react-tailwind-variants';

export const Container = styled('article', {
  variants: {
    type: {
      pdpForm: 'md:max-w-[17.67vw] xl:max-w-[17.824vw] 2xl:max-w-[16.289vw]',
      pageDescription: 'md:max-w-[23.321vw] 2xl:max-w-[21.796875vw]', //About & Collection paragraph at top
      assistance:
        'md:max-w-[41.289vw] xl:max-w-[38.773vw] 2xl:max-w-[31.953125vw]',
      cart: 'md:max-w-[66vw] xl:max-w-[66.087vw] 2xl:max-w-[59.4921875vw] w-full mx-auto',
      index:
        'md:max-w-[84.589vw] xl:max-w-[85.4166vw] 2xl:max-w-[71.2109375vw]',
      slideshowIndex:
        'md:max-w-[38.324vw] xl:max-w-[42.592vw] 2xl:max-w-[39.0625vw] px-mobile md:px-0 mx-auto w-full', //Archive & Collection leader index of images
      preOrder:
        'md:max-w-[38.324vw] xl:max-w-[38.773vw] 2xl:max-w-[34.2578125vw]',
      customRequest:
        'md:max-w-[41.373vw] xl:max-w-[36.22vw] 2xl:max-w-[41.25vw]',
      sizeChart: 'md:max-w-[56.7vw] xl:max-w-[49.71vw] 2xl:max-w-[65vw]', // note: manually adjusted from design to fit new content
    },
  },
});

type ContainerVariantsConfig = VariantsConfigOf<typeof Container>;
