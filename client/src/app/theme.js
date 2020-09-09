const tertiary = '#acdadd';

const primary = 'white';
const primaryText = '#111'

const secondary100 = '#242729';
const secondary80 = '#2f3337';
const secondaryText = 'white'

const baseTheme = {
  screen: {
    l: 992,
    s: 444,
  },
  headerHeight: 60,
  primary,
  secondary: secondary100,
  tertiary,
  mainBackground: tertiary,
  mainHeader: secondary100,
  mainHeaderText: primary,
  subHeader: secondary80,
  courseTag: '#f1b14c',
  userTag: '#9ec8d2',
}

export const comfortTheme = {
  ...baseTheme,
  mainBackground: '#e0c299',
  secondaryBackground: 'blue',
  primary: '#d4c0a5',
  mainHeader: '#d4c0a5',
  subHeader: '#d2b58e',
  courseTag: '#f1b14c',
  userTag: '#9ec8d2',
}

export const defaultTheme = baseTheme;

export const darkTheme = {
  //TODO
}
