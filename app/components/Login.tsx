"use client";
import { useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify/utils";
import { fetchUserAttributes, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { useDispatch } from "react-redux";
import { setEmail } from "@/app/features/userSlice";
import { setSelectedId } from "@/app/features/selectedIdSlice";
import useLatestHistoryId from "@/app/hooks/useLatestHistoryId";

I18n.putVocabularies(translations);
I18n.setLanguage("ja");

const Login: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const latestId = useLatestHistoryId();

  const getAuth = async () => {
    try {
      const attributes = await fetchUserAttributes();
      if (attributes.email) {
        dispatch(setEmail(attributes.email));
      }
      console.log("Latest ID:", latestId);
      if (latestId.length > 0) {
        dispatch(setSelectedId(latestId));
      }
    } catch (error) {
      console.error("Error fetching user attributes:", error);
    }
  };

  useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          getAuth();
          break;
        case 'signedOut':
          break;
      }
    });
    getAuth();
  }, [latestId]);

  return (
    <Authenticator variation="modal">
      <div>
        {children}
      </div>
    </Authenticator>
  );
};

export default Login;
