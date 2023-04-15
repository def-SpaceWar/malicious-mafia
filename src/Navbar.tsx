import { Flex, Spacer, Heading } from "@chakra-ui/react";
import AuthenticationButtons from "./AuthenticationButtons";

const Navbar = () => {
  return (
    <Flex
      bgColor="darkBg" width="100vw" height="10vh"
      alignItems="center" paddingX={["20px", "20px"]}>
      <Heading>Malicious Mafia</Heading>
      <Spacer />
      <AuthenticationButtons />
    </Flex>
  );
};

export default Navbar;
