import '../../assets/loading.css';

export const Loading = {
  FlipSquare: ({ partialStyle }: { partialStyle?: boolean }) => (
    <div
      style={
        partialStyle
          ? {
              display: 'grid',
              placeItems: 'center',
              height: '50vh',
              background: 'inherit',
            }
          : {
              display: 'grid',
              placeItems: 'center',
              height: '100vh',
              background: 'inherit',
            }
      }
    >
      <div className='flip-square' />
    </div>
  ),
  Swap: ({ partialStyle }: { partialStyle?: boolean }) => (
    <div
      style={
        partialStyle
          ? {
              display: 'grid',
              placeItems: 'stretch',
              height: '50vh',
              background: 'inherit',
            }
          : {
              display: 'grid',
              placeItems: 'center',
              height: '100vh',
              background: 'inherit',
            }
      }
    >
      <div className='swap' />
    </div>
  ),
  Feeder: () => <div className='feeder' />,
  PanOutCircle: () => <div className='pan-out-circle' />,
};
