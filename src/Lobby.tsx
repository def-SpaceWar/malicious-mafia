import { Box, Text, Button, Input } from "@chakra-ui/react";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
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
    userInLobby = lobby.data?.find(m => m.uid === user.data?.uid),
    userInGame = game.data?.find(m => m.uid == user.data?.uid),
    [customIgn, setCustomIgn] = useState("");

  const
    joinLobby = async () => {
      if (!user.data) return;
      await setDoc(doc(firestore, "lobby", user.data.uid),
        {
          displayName: customIgn || user.data.displayName,
          uid: user.data.uid,
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
      return lobby.data?.reduce((count, m) =>
        (m.ready === true)
          ? count + 1
          : count
        , 0) || 0;
    },
    getLobbyColor = (): string => {
        const ready = amountReady();
        if (ready == lobby.data?.length) return "lightGreen";
        if (ready > 0) return "lightYellow";
        return "lightRed";
    },
    someoneHasSameIGN = (): boolean => {
      if (!lobby.data || !user.data) return true;
      const currentName = customIgn || user.data.displayName!;
      for (const data of lobby.data) if (data.displayName === currentName) return true;
      return false;
    };

  if (userInGame) {
    return <Game />;
  }

  return (
    <Box padding="50px">
      {
        (user.data)
          ? (<>
            <Text fontSize="3xl">In-Game Name (IGN): <Input
              fontSize="3xl"
              color={userInLobby ? "green" : someoneHasSameIGN() ? "red" : "green"}
              _placeholder={{ color: userInLobby ? "green" : someoneHasSameIGN() ? "red" : "green" }}
              placeholder={customIgn || user.data.displayName!} style={{
                width: "min(500px, 50vw)",
                outline: "none",
                border: "none"
              }}
              onChange={e => setCustomIgn(e.target.value)}
              isDisabled={!!userInLobby}
            />
            </Text>
          </>)
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
              <Button
                onClick={joinLobby}
                fontSize="3xl"
                bgColor="blue"
                _hover={{ bgColor: "lightBlue" }}
                isDisabled={someoneHasSameIGN()}
              >Join Lobby</Button>
            ) : <></>
      }
      <br />
      <br />
      {
        (lobby.data?.length > 0)
          ? <Text fontSize="5xl" color={getLobbyColor()}>Lobby ({amountReady()}/{lobby.data.length}):</Text>
          : <Text fontSize="5xl" color="yellow">Lobby:</Text>
      }
      {
        (lobby.data)
          ? lobby.data.map(m => {
            return (
              <Text fontSize="3xl">{m.displayName} - {m.ready
                ? <Text color="lightGreen" display="inline">Ready</Text>
                : <Text color="lightRed" display="inline">Not Ready</Text>}
              </Text>
            )
          })
          : <Text fontSize="3xl">Loading...</Text>
      }
    </Box>
  );
};

export default Lobby;
