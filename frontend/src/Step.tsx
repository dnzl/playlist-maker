import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  Container,
  Box,
  Flex,
  Heading,
  Avatar,
  Strong,
  Button,
  Separator,
  Text,
} from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { SelectionType } from "./types";

export type StepProps = PropsWithChildren & {
  step: number;
  title: string;
  collapsed?: boolean;
  selection?: SelectionType;
  goToNextStep: () => void;
  changeSelection?: () => void;
  nextButtonTitle?: string;
  isLastStep?: boolean;
};

export const Step = ({
  step,
  title,
  collapsed = false,
  selection,
  goToNextStep,
  changeSelection,
  nextButtonTitle = "Next",
  isLastStep = false,
  children,
}: StepProps) => (
  <Container mb="4">
    <Box>
      <Flex gap="3" align="center" justify="between">
        <Heading size="4">
          <Avatar fallback={step} mr="3" size="2" />
          {title}
        </Heading>
        {!isLastStep && selection?.value && (
          <Flex gap="1" direction="column" align="end">
            <Box>
              <Text size="2">
                Selected: <Strong>{selection.name}</Strong>
              </Text>
            </Box>
            {collapsed && (
              <Button onClick={changeSelection} variant="ghost">
                Change
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
    {!collapsed && (
      <Flex direction="column" gap="4" mt="5">
        {children}
        <Box my="2" style={{ alignSelf: "end" }}>
          <Button disabled={!isLastStep && !selection} onClick={goToNextStep}>
            {nextButtonTitle} <ChevronRightIcon />
          </Button>
        </Box>
      </Flex>
    )}
    <Separator my="4" size="4" />
  </Container>
);
