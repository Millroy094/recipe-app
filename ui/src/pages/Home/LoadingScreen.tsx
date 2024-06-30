import { Card, Container, Grid, Skeleton, Typography } from '@mui/material';
import { FC } from 'react';

const LoadingScreen: FC<{}> = () => (
  <Container maxWidth='lg'>
    <Grid container direction='column' spacing={2}>
      <Grid container item justifyContent='center'>
        <Typography variant='h4'>My Favorite Recipes</Typography>
      </Grid>
      <Grid item>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Skeleton width='100%' height={56} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton width='100%' height={56} />
            </Grid>
          </Grid>
          <Grid container justifyContent='flex-end' spacing={1}>
            <Grid item>
              <Skeleton width={132} height={56} />
            </Grid>
            <Grid item>
              <Skeleton width={132} height={56} />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item>
        <Card sx={{ p: 2 }}>
          <Skeleton width='100%' height={56} />
        </Card>
      </Grid>
    </Grid>
  </Container>
);

export default LoadingScreen;
