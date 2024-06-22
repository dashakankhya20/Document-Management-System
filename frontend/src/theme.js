import { createTheme } from '@mui/material/styles';
import { lightBlue, grey, blue, indigo, purple, cyan, teal, lime } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: lightBlue[200],
      dark: lightBlue[800],
      paper1: blue[400],
      paper2: indigo[400],
      paper3: purple[400],
      paper4: cyan[400],
      paper5: teal[400],
      paper6: lime[600]

    },
    
  },
  typography: {
    h1: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '1rem',
        color: grey[800],
        textShadow: 'none', 
        letterSpacing: '0.1em', 
    },
    h2: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        color: 'whitesmoke',
        textShadow: 'none', 
    },
    h4:{
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '2rem',
        color: grey[800],
        textShadow: 'none', 
        letterSpacing: '0.1em', 
    },
    h5:{
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '6rem',
      color: 'white',
      letterSpacing: '0.1em', 
    }
    // Add more typography customization as needed
  },
});
