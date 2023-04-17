import { Button, Flex } from "@chakra-ui/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { Role, TimeOfDay } from "./Game";
import { useState } from "react";

type SelectorProps = {
  role: Role,
  timeOfDay: TimeOfDay
};

const KillSelector = () => {
  const
    auth = useAuth(),
    firestore = useFirestore(),
    gamePlayersCollection = collection(firestore, "gamePlayers"),
    gamePlayers = useFirestoreCollectionData(gamePlayersCollection);

  let ready = false;
  const
    playerList: string[] = [],
    [selectedTarget, setSelectedTarget] = useState<string | undefined>(undefined),
    otherMafiaChose = (name: string) => {
      let hasBeenSelected = false;
      gamePlayers.data?.map((m) => {
        if (m.name == auth.currentUser?.displayName) return;
        if (m.role != "mafia") return;
        if (m.selectedTarget == name) {
          if (selectedTarget == m.selectedTarget) setSelectedTarget(undefined);
          hasBeenSelected = true;
        }
      });
      return hasBeenSelected;
    },
    saveSelection = () => {
      setDoc(doc(firestore, "gamePlayers", auth.currentUser!.uid), {
        selectedTarget
      }, { merge: true });
    };

  let target = selectedTarget;

  gamePlayers.data?.map((m) => {
    if (m.role == "mafia") {
      if (m.selectedTarget != undefined && m.uid == auth.currentUser?.uid) {
        target = m.selectedTarget;
        ready = true;
      }

      return;
    }
    playerList.push(m.name);
  });

  return (
    <Flex flexDir="column">
      {
        playerList.map((p) =>
          (target == p || otherMafiaChose(p))
            ? <Button
              fontSize="6xl" padding="40px"
              bgColor="darkRed"
              _hover={{ bgColor: "darkRed" }}
              isDisabled>
              {p}</Button>
            : (ready)
              ? <Button
                fontSize="6xl" padding="40px"
                bgColor="darkGreen"
                _hover={{ bgColor: "darkGreen" }}
                isDisabled>
                {p}</Button>
              : <Button
                fontSize="6xl" padding="40px"
                bgColor="green"
                _hover={{ bgColor: "red" }}
                onClick={() => setSelectedTarget(p)}>
                {p}</Button>
        )
      }
      {
        (ready)
          ?
          <Button
            marginTop="25px"
            fontSize="6xl" padding="40px"
            bgColor="darkYellow"
            _hover={{ bgColor: "darkYellow" }}
            isDisabled>
            Finalize!</Button>
          : (target == undefined)
            ? <></>
            : <Button
              marginTop="25px"
              fontSize="6xl" padding="40px"
              bgColor="yellow"
              _hover={{ bgColor: "lightYellow" }}
              onClick={saveSelection}>
              Finalize!</Button>
      }
    </Flex>
  );
};

const ProtectSelector = () => {
  const
    auth = useAuth(),
    firestore = useFirestore(),
    gamePlayersCollection = collection(firestore, "gamePlayers"),
    gamePlayers = useFirestoreCollectionData(gamePlayersCollection);

  let ready = false;
  const
    playerList: string[] = [],
    [selectedTarget, setSelectedTarget] = useState<string | undefined>(undefined),
    otherGuardianChose = (name: string) => {
      let hasBeenSelected = false;
      gamePlayers.data?.map((m) => {
        if (m.name == auth.currentUser?.displayName) return;
        if (m.role != "guardian") return;
        if (m.selectedTarget == name) {
          if (selectedTarget == m.selectedTarget) setSelectedTarget(undefined);
          hasBeenSelected = true;
        }
      });
      return hasBeenSelected;
    },
    saveSelection = () => {
      setDoc(doc(firestore, "gamePlayers", auth.currentUser!.uid), {
        selectedTarget
      }, { merge: true });
    };

  let target = selectedTarget;

  gamePlayers.data?.map((m) => {
    if (m.uid == auth.currentUser?.uid) {
      if (m.selectedTarget != undefined) {
        target = m.selectedTarget;
        ready = true;
      }
    }
    playerList.push(m.name);
  });

  return (
    <Flex flexDir="column">
      {
        playerList.map((p) =>
          (target == p || otherGuardianChose(p))
            ? <Button
              fontSize="6xl" padding="40px"
              bgColor="darkCyan"
              _hover={{ bgColor: "darkCyan" }}
              isDisabled>
              {p}</Button>
            : (ready)
              ? <Button
                fontSize="6xl" padding="40px"
                bgColor="darkRed"
                _hover={{ bgColor: "darkRed" }}
                isDisabled>
                {p}</Button>
              : <Button
                fontSize="6xl" padding="40px"
                bgColor="green"
                _hover={{ bgColor: "lightCyan" }}
                onClick={() => setSelectedTarget(p)}>
                {p}</Button>
        )
      }
      {
        (ready)
          ?
          <Button
            marginTop="25px"
            fontSize="6xl" padding="40px"
            bgColor="darkGreen"
            _hover={{ bgColor: "darkGreen" }}
            isDisabled>
            Finalize!</Button>
          : (target == undefined)
            ? <></>
            : <Button
              marginTop="25px"
              fontSize="6xl" padding="40px"
              bgColor="green"
              _hover={{ bgColor: "lightGreen" }}
              onClick={saveSelection}>
              Finalize!</Button>
      }
    </Flex>
  );
};

const VoteSelector = () => {
  return <></>;
};

const Selector = ({ role, timeOfDay }: SelectorProps) => {
  if (timeOfDay == "night" && role == "mafia") return <KillSelector />;
  if (timeOfDay == "night" && role == "guardian") return <ProtectSelector />;
  if (timeOfDay == "day" && role != "jester") return <VoteSelector />;
  return <></>;
};

export default Selector;
