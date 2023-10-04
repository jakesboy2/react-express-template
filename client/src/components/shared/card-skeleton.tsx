import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface IProps {
  initial?: boolean;
  height: string;
}

function CardSkeleton(props: IProps) {
  const { initial, height } = props;
  const paddingTop = initial ? '24px' : '16px';
  return (
    <Box
      width="100%"
      height={height}
      display="grid"
      sx={{
        paddingX: '24px',
        paddingTop,
        paddingBottom: '16px',
      }}
    >
      <Skeleton
        variant="rounded"
        width="100%"
        height="100%"
        sx={{
          padding: '16px',
        }}
      />
    </Box>
  );
}

export default CardSkeleton;
