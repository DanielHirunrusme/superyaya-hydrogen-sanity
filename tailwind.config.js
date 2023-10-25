/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    borderRadius: {
      DEFAULT: '8px',
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '15px',
      xl: '20px',
      full: '9999px',
    },
    boxShadow: {
      DEFAULT: '0px 0px 4px rgba(0, 0, 0, 0.1)',
    },
    fontFamily: {
      sans: 'EngraversGothic, "Helvetica Neue", Arial, sans-serif',
      radio: 'EngraversEF, serif',
      index: 'EurostileMonoEF, sans-serif',
      serif: 'Times New Roman, serif',
      cursive: 'Snell, cursive',
    },
    fontSize: {
      bodyMobile: [
        '3.846vw',
        {
          letterSpacing: '.075em',
          lineHeight: '1.2',
        },
      ],
      bodyTablet: [
        '1.005vw',
        {
          letterSpacing: '.09875em',
          lineHeight: '1.5',
        },
      ],
      bodyLaptop: [
        '0.9259vw',
        {
          letterSpacing: '.09875em',
          lineHeight: '1.25',
        },
      ],
      bodyDesktop: [
        '0.859375vw',
        {
          letterSpacing: '.09875em',
          lineHeight: ' 1.227',
        },
      ],
      // Utility (Header Actions)
      utilityMobile: [
        '3.0769vw',
        {
          letterSpacing: '.075em',
          lineHeight: '1.2',
        },
      ],
      utilityTablet: [
        '0.8375vw',
        {
          letterSpacing: '.09875em',
          lineHeight: '1.5',
        },
      ],
      utilityLaptop: [
        '0.7523vw',
        {
          letterSpacing: '.09875em',
          lineHeight: '1.25',
        },
      ],
      utilityDesktop: [
        '0.6640625vw',
        {
          letterSpacing: '.09875em',
          lineHeight: ' 1.227',
        },
      ],
      // Rte
      rteMobile: [
        '3.846vw',
        {
          letterSpacing: '.075em',
          lineHeight: '1.3333',
        },
      ],
      rteTablet: [
        '0.837520938vw',
        {
          letterSpacing: '.0875em',
          lineHeight: '1.4',
        },
      ],
      rteLaptop: [
        '0.7352vw',
        {
          letterSpacing: '.0875em',
          lineHeight: '1.38',
        },
      ],
      rteDesktop: [
        '0.625vw',
        {
          letterSpacing: '.0875em',
          lineHeight: '1.375',
        },
      ],
      // Index
      indexMobile: [
        '3.333vw',
        {
          letterSpacing: '.075em',
          lineHeight: '1.5',
        },
      ],
      indexTablet: [
        '1.0050vw',
        {
          letterSpacing: '.0875em',
          lineHeight: '1.5',
        },
      ],
      // indexLaptop: [
      //   '0.7352vw',
      //   {
      //     letterSpacing: '.0875em',
      //     lineHeight: '1.38',
      //   },
      // ],
      indexDesktop: [
        '0.625vw',
        {
          letterSpacing: '.0875em',
          lineHeight: '1.5',
        },
      ],
    },
    fontWeight: {
      bold: 700,
      medium: 500,
    },
    letterSpacing: {
      normal: '-0.03em',
    },
    lineHeight: {
      label: '.65',
      none: '1',
      field: '1.25',
      caption: '1.25',
      paragraph: '1.4',
    },
    extend: {
      colors: {
        darkGray: '#757575',
        gray: '#E7E7E7',
        lightGray: '#F3F3F3',
        offBlack: '#2B2E2E',
        peach: '#FFE1D1',
        red: '#EC5039',
        shopPay: '#5A31F4',
        yellow: 'yellow',
      },
      height: {
        'header-sm': '2.8rem',
        'header-lg': '6.25rem',
        'header-2xl': '5.3125rem',
        laptopBox: '2rem',
        desktopBox: '3.875rem',
      },
      listStyleType: {
        roman: 'upper-roman',
        alpha: 'upper-alpha',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        13: '52px',
        14: '56px',
        15: '60px',
        16: '64px',
        17: '68px',
        18: '72px',
        19: '76px',
        20: '80px',
        21: '84px',
        22: '88px',
        23: '92px',
        24: '96px',
        25: '100px',
        26: '104px',
        27: '108px',
        28: '112px',
        29: '116px',
        30: '120px',
        31: '124px',
        32: '128px',
        33: '132px',
        34: '136px',
        35: '140px',
        36: '144px',
        37: '148px',
        38: '152px',
        39: '156px',
        40: '160px',
        overlap: '20px',
        laptopBox: '2rem',
        desktopBox: '3.875rem',
        mobile: '4.6153vw',
        tablet: '1.34vw',
        laptop: '1.1574vw',
        desktop: '1.3671vw',
      },
      minHeight: {
        laptopBox: '2rem',
        desktopBox: '3.875rem',
      },
      maxWidth: {
        laptopForm: '16rem',
        desktopForm: '26.0625rem',
        desktopRte: '51.125rem',
        desktopContainer: '68.25rem',
      },
    },
  },
  plugins: [],
};
