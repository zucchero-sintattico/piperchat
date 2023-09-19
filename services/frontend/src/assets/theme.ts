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
    primary: '#395564',
    secondary: '#A5C6CA',
    accent: '#E7F622',
    dark: '#2C3333'
  }
]
