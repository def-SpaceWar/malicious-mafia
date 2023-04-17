import { Flex, Text, Spacer, Heading } from "@chakra-ui/react"
import { collection } from "firebase/firestore";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import Selector from "./Selector";

export type Role = "villager" | "guardian" | "mafia" | "jester";
export type Association = "innocent" | "mafia" | "third-party";
export type TimeOfDay = "night" | "day";

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
  },
  capitalizeTimeOfDay = (t: TimeOfDay): string => {
    return (t == "night")
      ? "Night"
      : (t == "day")
        ? "Day"
        : "Invalid";
  },
  timeOfDayToColor = (t: TimeOfDay): string => {
    return (t == "night")
      ? "darkBlue"
      : (t == "day")
        ? "lightYellow"
        : "#ff0000";
  },
  getMessage = (t: TimeOfDay, role: Role) => {
    if (t == "night" && role == "mafia") return "Choose someone to kill.";
    if (t == "night" && role == "guardian") return "Choose someone to protect.";
    if (t == "night") return "Hope you don't die!";

    if (t == "day" && role == "jester") return "You already voted yourself."
    if (t == "day") return "Vote someone.";
  };


const Game = () => {
  const
    auth = useAuth(),
    firestore = useFirestore(),
    gamePlayersCollection = collection(firestore, "gamePlayers"),
    gamePlayers = useFirestoreCollectionData(gamePlayersCollection),
    gameDataCollection = collection(firestore, "gameData"),
    gameData = useFirestoreCollectionData(gameDataCollection);

  const
    timeOfDay: TimeOfDay =
      gameData.data?.reduce((d, m) =>
        m.timeOfDay || d
        , "night"),
    role: Role =
      gamePlayers.data?.reduce((d, m) =>
        (m.uid == auth.currentUser?.uid)
          ? m.role
          : d
        , "villager"),
    association: Association =
      gamePlayers.data?.reduce((d, m) =>
        (m.uid == auth.currentUser?.uid)
          ? m.association
          : d
        , "innocent"),
    dead: boolean =
      gamePlayers.data?.reduce((d, m) =>
        (m.uid == auth.currentUser?.uid)
          ? m.dead
          : d
        , false);

  return (
    <>
      <Flex
        width="100vw"
        height="80vh"
        alignItems="center" justifyContent="center">
        {
          (!dead)
            ? <Selector role={role} timeOfDay={timeOfDay} />
            : <Text>You are dead!</Text>
        }
      </Flex>
      <Flex
        width="100vw"
        height="10vh"
        alignItems="center"
        padding="30px" bgColor="darkBg"
        columnGap="30px">
        <Heading fontSize="4xl" color={timeOfDayToColor(timeOfDay)}>{capitalizeTimeOfDay(timeOfDay)}</Heading>
        <Spacer />
        <Text fontSize="4xl">{getMessage(timeOfDay, role)}</Text>
        <Spacer />
        <Text fontSize="4xl" color={roleToColor(role)}>{capitalizeRole(role)}</Text>
        <Text fontSize="4xl" color={associationToColor(association)}>{capitalizeAssociation(association)}</Text>
      </Flex>
    </>
  );
};

export default Game;
