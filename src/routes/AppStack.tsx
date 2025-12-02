import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const { Navigator, Screen } = createStackNavigator();

import Login from "../pages/Login";
import EventsMap from "../pages/EventsMap";
import { AuthenticationContext, AuthenticationContextObject } from "../context/AuthenticationContext";
import { User } from "../types/User";

/*
    Root Navigation Stack for the App

    Responsibilities:
    - Hold the authenticated user in state.
    - Provide the AuthenticationContext to the app.
    - Define the navigation stack for the app.

    Inputs:
    - None

    Outputs:
    - Renders the NavigationContainer with the defined stack and context provider.

*/

export default function Routes() {
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

  const authenticationContextObj: AuthenticationContextObject = {
    value: authenticatedUser as User,
    setValue: setAuthenticatedUser,
  };

  return (
    <AuthenticationContext.Provider value={authenticationContextObj}>
      <NavigationContainer>
        <Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#F2F3F5" },
          }}
        >
          <Screen name="Login" component={Login} />

          <Screen name="EventsMap" component={EventsMap} />
        </Navigator>
      </NavigationContainer>
    </AuthenticationContext.Provider>
  );
}
