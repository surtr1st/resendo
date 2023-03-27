import '../../assets/loading.css';

export const Loading = {
  FlipSquare: () => (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
        background: 'inherit',
      }}
    >
      <div className='flip-square' />
    </div>
  ),
  Swap: ({ disabledStyle }: { disabledStyle?: boolean }) => (
    <div
      style={
        disabledStyle
          ? {}
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
