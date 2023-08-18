import { UIShellWrapper } from "@src/components/Wrapper/UIShellWrapper"

export const AppWrapper = (props) => {
  return (
    <UIShellWrapper>
      {props.children}
    </UIShellWrapper>
  )
}