import { Heading, Flex } from "@chakra-ui/react";
import { Association, associationToColor, capitalizeAssociation, capitalizeRole, Role, roleToColor } from "./Game";

type GameOverProps = {
  players: any[];
  winner: string;
  message: string;
};

const GameOver = ({ players, winner, message }: GameOverProps) => {
  let color = roleToColor(winner as Role);
  if (color == "#ff0000") color = associationToColor(winner as Association);
  if (color == "#ff0000") color = "darkFg";
  
  return (
    <Flex flexDir="column" rowGap="15px">
      <Heading color={color} fontSize="7xl" marginBottom="25px" textAlign="center">{message}</Heading>
      {
        players.map(player =>
          <Heading fontSize="5xl" color={roleToColor(player.role)} textAlign="center">
            {player.name}: {capitalizeRole(player.role)}:{capitalizeAssociation(player.association)}
            {(player.dead) ? ", Dead" : ""}
          </Heading>
        )
      }
    </Flex>
  );
};

export default GameOver;
