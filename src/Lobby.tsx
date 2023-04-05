import { Box, Text } from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";

const Lobby = () => {
  const
    lobbyCollection = collection(useFirestore(), "lobby"),
    lobby = useFirestoreCollectionData(lobbyCollection);

  const user = useUser();

  return (
    <Box padding="50px">
      {
        (lobby.data)
        ? lobby.data.map(m => {
          return (
            <Text fontSize="3xl">{m.displayName} {m.ready ? "- Ready" : ""}</Text>
          )
        })
        : <Text fontSize="3xl">Loading...</Text>
      }
      {
        (user.data)
        ? <Text fontSize="3xl">You: {user.data.displayName}, {user.data.email}, {user.data.uid}</Text>
        : <Text fontSize="3xl">You're not logged in!</Text>
      }
    </Box>
  );
};

export default Lobby;
