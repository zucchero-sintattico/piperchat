export interface Theme {
  label: string
  primary: string
  secondary: string
  accent: string
  dark: string
}

export const ThemesList: Theme[] = [
  {
    label: 'Classic',
    primary: '#007063',
    secondary: '#323232',
    accent: '#E4F9F5',
    dark: '#212121'
  },
  {
    label: 'Blue',
    primary: '#395B64',
    secondary: '#A5C9CA',
    accent: '#E7F6F2',
    dark: '#2C3333'
  },
  {
    label: 'Yellow',
    primary: '#3C6255',
    secondary: '#61876E',
    accent: '#EAE7B1',
    dark: '#2C3333'
  },
  {
    label: 'High Contrast',
    primary: '#606B6F',
    secondary: '#323232',
    accent: '#FOEFEE',
    dark: '#333СЗЕ'
  }
]

export interface FontFamily {
  label: string
  value: string
}

export const FontFamilies: FontFamily[] = [
  {
    label: 'Roboto',
    value: 'Roboto'
  },
  {
    label: 'OpenDyslexic',
    value: 'OpenDyslexic'
  }
]
