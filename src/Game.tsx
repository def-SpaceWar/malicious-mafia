import { Flex, Text } from "@chakra-ui/react"
import { collection } from "firebase/firestore";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";

type Role = "villager" | "guardian" | "mafia" | "jester";
type Association = "innocent" | "mafia" | "third-party";

const
  capitalizeRole = (r: Role): string => {
    return (r == "villager")
      ? "Villager"
      : (r == "guardian")
        ? "Guardian"
        : (r == "mafia")
          ? "Mafia"
          : (r == "jester")
            ? "Jester"
            : "Invalid";
  },
  roleToColor = (r: Role): string => {
    return (r == "villager")
      ? "lightGreen"
      : (r == "guardian")
        ? "green"
        : (r == "mafia")
          ? "red"
          : (r == "jester")
            ? "magenta"
            : "#ff0000";
  },
  capitalizeAssociation = (a: Association): string => {
    return (a == "innocent")
      ? "Innocent"
      : (a == "mafia")
        ? "Mafia"
        : (a == "third-party")
          ? "Third-Party"
          : "Invalid";
  },
  associationToColor = (a: Association): string => {
    return (a == "innocent")
      ? "lightBlue"
      : (a == "mafia")
        ? "red"
        : (a == "third-party")
          ? "purple"
          : "#ff0000";
  };


const Game = () => {
  const
    auth = useAuth(),
    firestore = useFirestore(),
    gamePlayersCollection = collection(firestore, "gamePlayers"),
    gamePlayers = useFirestoreCollectionData(gamePlayersCollection);

  let
    role: Role = "villager",
    association: Association = "innocent";

  gamePlayers.data.map((m) => {
    if (m.uid == auth.currentUser?.uid) {
      role = m.role as Role;
      association = m.association as Association;
    }
  });

  return (
    <>
      <Flex
        width="100vw"
        top="90vh" height="10vh"
        alignItems="center" position="absolute"
        padding="30px" bgColor="darkBg"
        columnGap="30px">
        <Text fontSize="4xl" color={roleToColor(role)}>{capitalizeRole(role)}</Text>
        <Text fontSize="4xl" color={associationToColor(association)}>{capitalizeAssociation(association)}</Text>
      </Flex>
    </>
  );
};

export default Game;
