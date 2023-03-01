import { Noto_Sans_JP, M_PLUS_Rounded_1c, Source_Code_Pro } from "next/font/google"

export const strongFont = Noto_Sans_JP({
    weight: ['400', '700', '900'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--notosans'
});

export const textFont = M_PLUS_Rounded_1c({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--mplus'
})

export const codeFont = Source_Code_Pro({
    subsets: ['latin'],
    display: 'swap',
    variable: '--source-code-pro'
});
