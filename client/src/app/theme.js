const tertiary = '#acdadd';

const primary = 'white';
const primary80 = '#eee';
const primary60 = '#ddd';
const primaryText = '#111'

const secondary100 = '#2b4658';
const secondary80 = '#2f3337';
const secondaryText = 'white'

const baseTheme = {
  font: {
    family: {
      default: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif`
    },
    size: {
      //TODO
    }
  },
  screen: {
    l: 992,
    s: 444,
  },
  headerHeight: 60,
  primary,
  primary80,
  primary60,
  secondary: secondary100,
  secondaryText,
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
