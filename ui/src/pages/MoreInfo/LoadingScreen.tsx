import { FC } from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Card,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LoadingScreen: FC<{}> = () => (
  <Container maxWidth='lg' sx={{ p: 2 }}>
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2} direction='column'>
        <Grid item>
          <Skeleton width='100%' height={58} />
        </Grid>

        <Grid item>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='accordion-content'
              id='accordion-header'
            >
              <Typography variant='h6'>Ingredients</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction='column' spacing={2}>
                <Grid container item spacing={2}>
                  <Grid item xs={6}>
                    <Skeleton width='100%' height={58} />
                  </Grid>
                  <Grid item xs={4}>
                    <Skeleton width='100%' height={58} />
                  </Grid>
                  <Grid item xs={1}>
                    <Skeleton width='100%' height={58} />
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
            <AccordionActions>
              <Skeleton width={132} height={58} />
            </AccordionActions>
          </Accordion>
        </Grid>

        <Grid item>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='accordion-content'
              id='accordion-header'
            >
              <Typography variant='h6'>Steps</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction='column' spacing={2}>
                <Grid container item spacing={2}>
                  <Grid item xs={10}>
                    <Skeleton width='100%' height={58} />
                  </Grid>
                  <Grid container item xs={2} spacing={2}>
                    <Grid item xs={4}>
                      <Skeleton width='100%' height={58} />
                    </Grid>
                    <Grid item xs={4}>
                      <Skeleton width='100%' height={58} />
                    </Grid>
                    <Grid item xs={4}>
                      <Skeleton width='100%' height={58} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
            <AccordionActions>
              <Skeleton width={132} height={58} />
            </AccordionActions>
          </Accordion>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2, mb: 2 }} />

      <Grid container spacing={2} justifyContent='flex-end'>
        <Grid item>
          <Skeleton width={132} height={58} />
        </Grid>
        <Grid item>
          <Skeleton width={132} height={58} />
        </Grid>
      </Grid>
    </Card>
  </Container>
);

export default LoadingScreen;
