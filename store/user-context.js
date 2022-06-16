import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const UserContext = createContext({
  user: {},
  isAuthenticated: false,
  addUser: (user) => {},
  removeUser: () => {},
});

function UserContextProvider({ children }) {
  const [user, setUser] = useState();

  function addUser(user) {
    setUser(user);
    AsyncStorage.setItem("user", JSON.stringify(user));
  }

  function removeUser() {
    setUser(null);
    AsyncStorage.removeItem("user");
  }

  const value = {
    user: user,
    isAuthenticated: !!user,
    addUser: addUser,
    removeUser: removeUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
