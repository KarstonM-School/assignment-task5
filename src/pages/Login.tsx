import { useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import BigButton from "../components/BigButton";
import Spacer from "../components/Spacer";
import { AuthenticationContext } from "../context/AuthenticationContext";
import logoImg from "../images/logo.png";
import * as api from "../services/api";
import { getFromCache, setInCache } from "../services/caching";
import { User } from "../types/User";
import { isTokenExpired, sanitizeEmail, validateEmail } from "../utils";

/*
    Login Page Component

    Responsibilities:
    - Render the login form
    - Handle user input and validation
    - Authenticate the user via the API
    - Manage authentication state via AuthenticationContext
    - Navigate to EventsMap on successful login

    Inputs:
    - navigation: Navigation prop from React Navigation

    Outputs:
    - Renders the login UI
    - Updates authentication context on successful login
*/

export default function Login({ navigation }: StackScreenProps<any>) {
  const authenticationContext = useContext(AuthenticationContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState<boolean>();
  const [passwordIsInvalid, setPasswordIsInvalid] = useState<boolean>();
  const [authError, setAuthError] = useState<string>();

  const [accessTokenIsValid, setAccessTokenIsValid] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const isFocused = useIsFocused();

  /*
    Effect: on component mount or authError change

    - Responsibilities:
      - Check for cached user info and access token
      - Update authentication context if cached user info is found
      - Validate access token and update state
      - Display alert if there is an authentication error

    Inputs:
    - authError: Current authentication error message

    Outputs:
    - Updates authentication context and access token validity state
    - Displays alert for authentication errors
  */
  useEffect(() => {
    getFromCache("userInfo").then(
      (cachedUserInfo) => authenticationContext?.setValue(cachedUserInfo as User),
      (error: any) => console.log(error)
    );
    getFromCache("accessToken").then(
      (accessToken) => accessToken && !isTokenExpired(accessToken as string) && setAccessTokenIsValid(true),
      (error: any) => console.log(error)
    );
    if (authError)
      Alert.alert("Authentication Error", authError, [{ text: "Ok", onPress: () => setAuthError(undefined) }]);
  }, [authError]);

  /*
    Effect: on accessTokenIsValid or authenticationContext change

    - Responsibilities:
      - Navigate to EventsMap if access token is valid and user is authenticated

    Inputs:
    - accessTokenIsValid: Boolean indicating if the access token is valid
    - authenticationContext: Current authentication context

    Outputs:
    - Navigates to EventsMap screen

  */
  useEffect(() => {
    if (accessTokenIsValid && authenticationContext?.value) navigation.navigate("EventsMap");
  }, [accessTokenIsValid]);

  /*
    Function: handleAuthentication

    - Responsibilities:
        - Validate the login form
        - Call the authenticateUser API with sanitized email and password
        - On success, cache user info and access token, update authentication context, and navigate to EventsMap
        - On failure, set authentication error message

    Inputs:
        - Uses email and password state variables

    Outputs:
        - Updates authentication context and navigates on success
        - Sets authError state on failure
  */
  const handleAuthentication = () => {
    if (formIsValid()) {
      setIsAuthenticating(true);
      api
        .authenticateUser(sanitizeEmail(email), password)
        .then((response) => {
          setInCache("userInfo", response.data.user);
          setInCache("accessToken", response.data.accessToken);
          authenticationContext?.setValue(response.data.user);
          setIsAuthenticating(false);
          123;
          navigation.navigate("EventsMap");
        })
        .catch((error) => {
          if (error.response) {
            setAuthError(error.response.data);
          } else {
            setAuthError("Something went wrong.");
          }
          setIsAuthenticating(false);
        });
    }
  };

  /*
    Function: formIsValid

    - Responsibilities:
        - Validate email and password fields
        - Update state for invalid fields

    Inputs:
        - Calls isEmailInvalid and isPasswordInvalid functions

    Outputs:
        - Returns boolean indicating if the form is valid
  */
  const formIsValid = () => {
    const emailIsValid = !isEmailInvalid();
    const passwordIsValid = !isPasswordInvalid();
    return emailIsValid && passwordIsValid;
  };

  /*
    Function: isPasswordInvalid

    - Responsibilities:
        - Check if the password meets minimum length requirement
        - Update state for password validity

    Inputs:
        - Uses password state variable

    Outputs:
        - Returns boolean indicating if the password is invalid
  */
  const isPasswordInvalid = (): boolean => {
    const invalidCheck = password.length < 6;
    setPasswordIsInvalid(invalidCheck);
    return invalidCheck ? true : false;
  };

  /*
    Function: isEmailInvalid

    - Responsibilities:
        - Validate the email format
        - Update state for email validity

    Inputs:
        - Calles validateEmail utility with email state variable

    Outputs:
        - Returns boolean indicating if the email is invalid
  */

  const isEmailInvalid = (): boolean => {
    const invalidCheck = !validateEmail(email);
    setEmailIsInvalid(invalidCheck);
    return invalidCheck ? true : false;
  };

  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      colors={["#031A62", "#00A3FF"]}
      style={styles.gradientContainer}
    >
      {isFocused && <StatusBar animated translucent style="light" />}
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          padding: 24,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            width: 240,
            height: 142,
            alignSelf: "center",
          }}
          source={logoImg}
        />
        <Spacer size={80} />
        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Email</Text>
          {emailIsInvalid && <Text style={styles.error}>invalid email</Text>}
        </View>
        <TextInput
          style={[styles.input, emailIsInvalid && styles.invalid]}
          onChangeText={(value) => setEmail(value)}
          onEndEditing={isEmailInvalid}
        />

        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Password</Text>
          {passwordIsInvalid && <Text style={styles.error}>invalid password</Text>}
        </View>
        <TextInput
          style={[styles.input, passwordIsInvalid && styles.invalid]}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          onEndEditing={isPasswordInvalid}
        />
        <Spacer size={80} />
        <BigButton style={{ marginBottom: 8 }} onPress={handleAuthentication} label="Log in" color="#FF8700" />
        <Spinner
          visible={isAuthenticating}
          textContent={"Authenticating..."}
          overlayColor="#031A62BF"
          textStyle={styles.spinnerText}
        />
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  spinnerText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },

  label: {
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  inputLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderColor: "#D3E2E5",
    borderRadius: 8,
    height: 56,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    color: "#5C8599",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  invalid: {
    borderColor: "red",
  },

  error: {
    color: "white",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
  },
});
