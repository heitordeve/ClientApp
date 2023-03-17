import React, { useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';

import { IcExpandMore } from 'components/ui/icons';
import { Title } from 'components/ui/typography/v2';
import { schemeMap, ColorScheme, colorMap } from 'styles/consts';
import { useAccordion } from './accordionProvider';

interface AccordionProps {
  background: string;
}

const Accordion = withStyles({
  root: {
    background: (props: AccordionProps) => colorMap.get(props.background) ?? props.background,
  },
  expanded: {},
})(MuiAccordion);

interface AccordionHeadProps {
  color: ColorScheme;
}

const AccordionHead = withStyles({
  root: (props: AccordionHeadProps) => {
    const sheme = schemeMap.get(props.color);
    return {
      backgroundColor: sheme?.color ?? '#fff',
      color: sheme?.text ?? 'unset',
    };
  },
  expandIcon: {
    color: (props: AccordionHeadProps) => schemeMap.get(props.color)?.text ?? 'unset',
  },
})(MuiAccordionSummary);

const AccordionBody = withStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiAccordionDetails);

interface FaqGroupProps {
  id: number | string;
  title: string;
  color?: ColorScheme;
  background?: string;
  children?: React.ReactNode;
}

const FaqGroup: React.FC<FaqGroupProps> = ({ id, children, title, color, background }) => {
  const { expanded, setExpanded } = useAccordion();

  const handleChange = useCallback(
    (panel: string | number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : null);
    },
    [setExpanded],
  );

  return (
    <Accordion
      expanded={expanded === id}
      onChange={handleChange(id)}
      id={'faq-group-' + id}
      background={background}
    >
      <AccordionHead aria-controls={title} expandIcon={<IcExpandMore />} color={color}>
        <Title>{title}</Title>
      </AccordionHead>
      <AccordionBody>{children}</AccordionBody>
    </Accordion>
  );
};
export default FaqGroup;
