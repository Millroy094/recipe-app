import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode } from 'react';

interface AddItemAccordionProps {
  addItemButtonLabel: string;
  title: string;
  error: string;
  addItemButtonTestId: string;
  children: ReactNode;
  handleAddItem: () => void;
}

const AddItemAccordion = (props: AddItemAccordionProps) => {
  const {
    addItemButtonLabel,
    title,
    error,
    addItemButtonTestId,
    children,
    handleAddItem,
  } = props;
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='accordion-content'
        id='accordion-header'
      >
        <Grid container direction='column'>
          <Typography variant='h6'>{title}</Typography>
          {error && (
            <Typography variant='subtitle1' color='error'>
              {error}
            </Typography>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
      <AccordionActions>
        <Button
          variant='contained'
          color='success'
          onClick={handleAddItem}
          data-testid={addItemButtonTestId}
        >
          {addItemButtonLabel}
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default AddItemAccordion;
