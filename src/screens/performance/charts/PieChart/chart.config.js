import { APP_THEME, chartColors } from '../../../../constants';

export default isPortrait => ({
  title: {
    textAnchor: 'middle',
    dy: 10
  },
  legend: {
    orientation: 'horizontal'
  },
  pie: {
    animate: {
      onLoad: {
        duration: 500,
        easing: 'polyInOut'
      }
    },
    colorScale: chartColors,
    padding: 0
  },
  chartSizes: {
    small: {
      chart: {
        height: 50,
        width: isPortrait ? 310 : 400
      },
      pie: {
        width: isPortrait ? 310 : 400,
        height: 250,
        labelRadius: 100
      },
      legend: {
        width: isPortrait ? 310 : 400,
        height: 50,
        itemsPerRow: 2
      }
    },
    large: {
      title: {
        dx: 250,
        dy: 10,
        style: {
          fontSize: 23,
          fill: APP_THEME.APP_FONT_COLOR_DARK
        }
      },

      chart: {
        width: isPortrait ? 500 : 700,
        height: 50
      },
      pie: {
        width: 500,
        height: isPortrait ? 500 : 350,
        labelRadius: 190,
        padding: {
          top: 40,
          bottom: 20
        },
        style: {
          labels: {
            fontSize: 18
          }
        }
      },
      legend: {
        width: 500,
        height: 50,
        itemsPerRow: 3
      }
    }
  }
});
