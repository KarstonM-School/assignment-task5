import { createContext } from "react";
import { User } from "../types/User";

/*
    Authentication Context Object
    - `value`: The current authenticated user (or undefined if not logged in)
    - `setValue`: Function to update the authenticated user from anywhere in the app

*/
export type AuthenticationContextObject = {
  value: User;
  setValue: (newValue: User | undefined) => void;
};

/*
    Global React context used to expose authentication state across the app

    Responsibilities:
    - Provide access to the current authenticated user
    - Allow updating the authenticated user state

    Default Value is 'undefined' and is set in `AppStack.tsx` when the app initializes
*/

export const AuthenticationContext = createContext<AuthenticationContextObject | null>(null);
