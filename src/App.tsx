import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { AuthProvider, FirestoreProvider, useFirebaseApp } from "reactfire";
import Lobby from "./Lobby";
import Navbar from "./Navbar";

const App = () => {
  const
    firebaseApp = useFirebaseApp(),
    auth = getAuth(firebaseApp),
    firestore = getFirestore(firebaseApp);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <Navbar />
        <Lobby />
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;