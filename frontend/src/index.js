import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./Main";
import { MyContext } from "./Components/MyContext";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme";

function MainApp() {
  const [user, setUser] = useState({});
  const [forms, setForms] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  return (
    <React.StrictMode>
      <MyContext.Provider
        value={{
          user,
          setUser,
          forms,
          setForms,
          users,
          setUsers,
          departments,
          setDepartments
        }}
      >
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </MyContext.Provider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);
