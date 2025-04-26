import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Callout } from "@radix-ui/themes"

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Callout.Root color="red">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>
        {message}
      </Callout.Text>
    </Callout.Root>
  )
}