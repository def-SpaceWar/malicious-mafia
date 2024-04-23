import { Flex, Text, Spacer, Heading } from "@chakra-ui/react"
import { collection } from "firebase/firestore";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import GameOver from "./GameOver";
import PlayerList from "./PlayerList";
import Selector from "./Selector";

export type Role = "villager"
  | "guardian" | "mafia" | "jester"
  | "mayor" | "assasin"
  | "host" | "impostor" | "reflector";
export type Association = "innocent" | "mafia" | "third-party";
export type TimeOfDay = "night" | "kingNight" | "hostNight" | "day" | "kingDay" | "hostDay";

export const
  capitalizeRole = (r: Role): string => {
    return (r == "villager")
      ? "Villager"
      : (r == "guardian")
        ? "Guardian"
        : (r == "mafia")
          ? "Mafia"
          : (r == "jester")
            ? "Jester"
            : (r == "mayor")
              ? "Mayor"
              : (r == "assasin")
                ? "Assassin"
                : (r == "host")
                  ? "Host"
                  : (r == "impostor")
                    ? "Impostor"
                    : (r == "reflector")
                      ? "Reflector"
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
            : (r == "mayor")
              ? "yellow"
              : (r == "assasin")
                ? "darkRed"
                : (r == "host")
                  ? "fg"
                  : (r == "impostor")
                    ? "orange"
                    : (r == "reflector")
                      ? ""
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
    return (t == "night" || t == "hostNight" || t == "kingNight")
      ? "Night"
      : (t == "day" || t == "hostDay" || t == "kingDay")
        ? "Day"
        : "Invalid";
  },
  timeOfDayToColor = (t: TimeOfDay): string => {
    return (t == "night" || t == "hostNight" || t == "kingNight")
      ? "darkBlue"
      : (t == "day" || t == "hostDay" || t == "kingDay")
        ? "lightYellow"
        : "#ff0000";
  },
  getMessage = (t: TimeOfDay, role: Role, dead: boolean) => {
    if (dead) return "You are dead! Witness the chaos!";

    if (t == "night" && role == "mafia") return "Choose someone to kill.";
    if (t == "night" && role == "assasin") return "You kill every other round.";
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
        , false),
    gameOver: boolean =
      gameData.data?.reduce((gameOver, m) =>
        m.gameOver ? m.gameOver : gameOver
        , false),
    winner: string =
      gameData.data?.reduce((winner, m) =>
        m.winner ? m.winner : winner
        , "tie") || "tie",
    message: string = gameData.data?.reduce((msg, m) =>
      m.message ? m.message : msg
      , ""),
    roundNumber: number = gameData.data?.reduce((num, m) =>
      m.roundNumber ? m.roundNumber : num
      , 0) || 0,
    ign: string = gamePlayers.data?.reduce((n, m) =>
      m.uid === auth.currentUser?.uid ? m.name : n
      , "undefined"),
    roleColor = roleToColor(role),
    associationColor = associationToColor(association);

  return (
    <>
      <Flex
        width="100vw"
        height={(gameOver) ? "90vh" : "80vh"}
        alignItems="center" justifyContent="center">
        {
          (gameOver)
            ? <GameOver players={gamePlayers.data} winner={winner} message={message} />
            : (
              <>
                <Flex width="20vw" height="80vh" bgColor="darkBg" alignItems="center" justifyContent="center" padding="20px">
                  <Heading fontSize="3xl" textAlign="center">{message}</Heading>
                </Flex>
                <Flex width="80vw" height="80vh" alignItems="center" justifyContent="center">
                  {
                    (!dead)
                      ? <Selector role={role} timeOfDay={timeOfDay} roundNumber={roundNumber} />
                      : <PlayerList players={gamePlayers.data} />
                  }
                </Flex>
              </>
            )
        }
      </Flex>
      {
        (!gameOver)
          ? <Flex
            width="100vw"
            height="10vh"
            alignItems="center"
            padding="30px" bgColor="darkBg"
            columnGap="30px">
            <Heading
              fontSize="4xl"
              color={timeOfDayToColor(timeOfDay)}
              title="Time Of Day"
            >
              {capitalizeTimeOfDay(timeOfDay)}
            </Heading>
            <Spacer />
            <Text fontSize="4xl">{getMessage(timeOfDay, role, dead)}</Text>
            <Spacer />
            <Text fontSize="4xl" color={roleColor} title="Role">
              {capitalizeRole(role)}
            </Text>
            <Text
              fontSize="4xl"
              color={associationColor}
              title="Association"
            >{capitalizeAssociation(association)}</Text>
            <Text
              fontSize="4xl"
              color={roleColor}
              title="Your In-Game Name (IGN)"
              textDecoration="underline double"
              textDecorationColor={associationColor}
            >{ign}</Text>
          </Flex>
          : <> </>
      }
    </>
  );
};

export default Game;
