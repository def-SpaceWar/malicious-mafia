import { Heading, Flex } from "@chakra-ui/react";
import { associationToColor, capitalizeAssociation, capitalizeRole } from "./Game";

type PlayerListProps = {
  players: any[];
};

const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <Flex direction="column" rowGap="25px">
      {
        players.map(player =>
          <Heading fontSize="5xl" color={associationToColor(player.association)}>
            {player.name}: {capitalizeRole(player.role)}:{capitalizeAssociation(player.association)}
            {(player.dead) ? ", Dead" : ""}
          </Heading>
        )
      }
    </Flex>
  )
};

export default PlayerList;