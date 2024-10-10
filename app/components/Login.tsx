"use client";
import { useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify/utils";
import { fetchUserAttributes, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { setEmail } from "@/app/features/userSlice";

I18n.putVocabularies(translations);
I18n.setLanguage("ja");

const Login: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const getAuth = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    if (attributes.email) {
      dispatch(setEmail(attributes.email));
    }
  };

  useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          getAuth();
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          break;
      }
    });
    getAuth();
  }, []);

  return (
    <Authenticator variation="modal">
      <div>
        {children}
      </div>
    </Authenticator>
  );
};

export default Login;
