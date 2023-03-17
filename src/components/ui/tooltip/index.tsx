import React from 'react';

import { Theme, makeStyles } from '@material-ui/core/styles';
import { default as TooltipMd, TooltipProps as TooltipMdProps } from '@material-ui/core/Tooltip';
import { schemeMap, Colors, gray5 } from 'styles/consts';

interface TooltipProps extends TooltipMdProps {
  color?: Colors;
}

const Tooltip: React.FC<TooltipProps> = ({ title, color, children, ...rest }) => {

  rest.disableFocusListener = rest.disableFocusListener || !title;
  rest.disableHoverListener = rest.disableHoverListener || !title;
  rest.disableTouchListener = rest.disableTouchListener || !title;

  const colorHex = schemeMap.get(color).accent;
  const classes = makeStyles((theme: Theme) => ({
    arrow: {
      color: colorHex,
    },
    tooltip: {
      backgroundColor: colorHex,
      color: gray5,
    },
  }))();
  return (
    <TooltipMd arrow classes={classes} title={title} {...rest}>
      {children}
    </TooltipMd>
  );
};
export default Tooltip;
