import { Button } from '@chakra-ui/react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { useAuth } from "reactfire";

const AuthenticationButtons = () => {
  const
    auth = useAuth(),
    provider = new GoogleAuthProvider(),
    [signedIn, setSignedIn] = useState(false);

  const
    signIn = async () => {
      await signInWithPopup(auth, provider);
      setSignedIn(!!auth.currentUser);
    },
    signOut = async () => {
      await auth.signOut();
      setSignedIn(!!auth.currentUser);
    };

  onAuthStateChanged(auth, (user) => {
    setSignedIn(!!user);
  })

  return (
    signedIn
      ? <Button onClick={signOut} bgColor="red" _hover={{ backgroundColor: "lightRed" }} fontSize="3xl">Sign Out</Button>
      : <Button onClick={signIn} bgColor="green" _hover={{ backgroundColor: "lightGreen" }} fontSize="3xl">Sign In</Button>
  );
};

export default AuthenticationButtons;