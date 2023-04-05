import { Flex, Spacer, Text } from "@chakra-ui/react";
import AuthenticationButtons from "./AuthenticationButtons";

const Navbar = () => {
  return (
    <Flex
      bgColor="darkBg" width="100vw" height="10vh"
      alignItems="center" paddingX={["2vw", "2vw"]}>
      <Text fontSize="3xl">Malicious Mafia</Text>
      <Spacer />
      <AuthenticationButtons />
    </Flex>
  );
};

export default Navbar;
