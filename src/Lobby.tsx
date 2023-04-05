import { Box, Text, Button } from "@chakra-ui/react";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import Game from "./Game";

const Lobby = () => {
  const
    firestore = useFirestore(),
    lobbyCollection = collection(firestore, "lobby"),
    lobby = useFirestoreCollectionData(lobbyCollection),
    gameCollection = collection(firestore, "gamePlayers"),
    game = useFirestoreCollectionData(gameCollection);

  const
    user = useUser(),
    userInLobby = lobby.data?.find(m => m.email === user.data?.email),
    userInGame = game.data?.find(m => m.email == user.data?.email);

  const
    joinLobby = async () => {
      if (!user.data) return;
      await setDoc(doc(firestore, "lobby", user.data.uid),
        {
          displayName: user.data.displayName,
          email: user.data.email,
          ready: false
        });
    },
    leaveLobby = async () => {
      if (!user.data) return;
      await deleteDoc(doc(firestore, "lobby", user.data.uid));
    },
    setReadiness = async (readiness: boolean) => {
      if (!user.data) return;
      await setDoc(doc(firestore, "lobby", user.data.uid),
        {
          ready: readiness
        }, { merge: true });
    },
    amountReady = (): number => {
      if (!lobby.data) return 0;
      let count = 0;
      lobby.data.map((m) => {
        if (m.ready === true) {
          count += 1;
        }
      });
      return count;
    };

  if (userInGame) {
    leaveLobby()
    return <Game />
  }

  return (
    <Box padding="50px">
      {
        (user.data)
          ? <Text fontSize="3xl">You: {user.data.displayName}, {user.data.email}, {user.data.uid}</Text>
          : <Text fontSize="3xl">You're not logged in!</Text>
      }
      <br />
      {
        (userInLobby)
          ? (
            <>
              <Button onClick={leaveLobby} fontSize="3xl" bgColor="red" _hover={{ backgroundColor: "lightRed" }} marginRight="15px">Leave Lobby</Button>
              {
                (userInLobby.ready)
                  ? <Button onClick={() => setReadiness(!userInLobby.ready)} fontSize="3xl" bgColor="purple" _hover={{ bgColor: "lightPurple" }}>Unready</Button>
                  : <Button onClick={() => setReadiness(!userInLobby.ready)} fontSize="3xl" bgColor="orange" _hover={{ bgColor: "lightOrange" }}>Ready</Button>
              }
            </>
          )
          : (user.data)
            ? (
              <Button onClick={joinLobby} fontSize="3xl" bgColor="blue" _hover={{ bgColor: "lightBlue" }}>Join Lobby</Button>
            ) : <></>
      }
      {
        (lobby.data?.length > 0)
          ? <Text fontSize="5xl">Lobby ({amountReady()}/{lobby.data.length}):</Text>
          : <Text fontSize="5xl">Lobby:</Text>
      }
      {
        (lobby.data)
          ? lobby.data.map(m => {
            return (
              <Text fontSize="3xl">{m.displayName} {m.ready ? "- Ready" : "- Not Ready"}</Text>
            )
          })
          : <Text fontSize="3xl">Loading...</Text>
      }
    </Box>
  );
};

export default Lobby;
