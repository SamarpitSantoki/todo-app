import { useStyledSystemPropsResolver } from "native-base";
import React from "react";

export const makeStyledComponent = (Component: any) => {
  return React.forwardRef<any, any>(({ debug, ...props }, ref) => {
    const [style, restProps] = useStyledSystemPropsResolver(props);
    return (
      <Component {...restProps} ref={ref} style={style}>
        {props.children}
      </Component>
    );
  });
};
