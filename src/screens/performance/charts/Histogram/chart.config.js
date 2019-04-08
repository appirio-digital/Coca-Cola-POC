import { APP_THEME, chartColors } from '../../../../constants';

export default isPortrait => ({
  chart: {
    animate: {
      onLoad: {
        duration: 500,
        easing: 'polyInOut'
      }
    },
    padding: {
      top: 0,
      bottom: 25,
      left: 35,
      right: 0
    }
  },
  title: {
    textAnchor: 'middle',
    dy: 10
  },
  bar: {
    cornerRadius: 2,
    style: {
      data: {
        fill: item => chartColors[item.eventKey % chartColors.length]
      }
    },
    label: {
      dy: 30,
      style: {
        fill: APP_THEME.APP_BASE_COLOR_WHITE
      }
    }
  },
  yAxis: {
    dependentAxis: true,
    fixLabelOverlap: true,
    orientation: 'left',
    offsetX: 40,
    style: {
      grid: {
        stroke: APP_THEME.APP_BASE_COLOR_GREY
      }
    }
  },
  xAxis: {
    // tickValues: []
    // label: {
    //   dy: -15
    // }
    // style: {
    //   tickLabels: {
    //     dx: 0,
    //     dy: 2,
    //     textAnchor: 'end',
    //     fill: APP_THEME.APP_BASE_COLOR_TRANSPARENT
    //   }
    // }
  },
  chartSizes: {
    small: {
      chart: {
        width: isPortrait ? 310 : 420,
        domainPadding: {
          x: isPortrait ? [50, 15] : [50, 30]
        },
        padding: {
          top: 10,
          bottom: 25,
          left: 33
        }
      },
      title: {
        dy: 15,
        dx: 200
      },
      bar: {},
      legend: {
        width: isPortrait ? 310 : 420,
        orientation: 'vertical',
        itemsPerRow: 2,
        gutter: 12
      }
    },
    large: {
      chart: {
        width: isPortrait ? 650 : 700,
        height: 500,
        domainPadding: {
          x: isPortrait ? [100, 95] : [100, 145]
        },
        padding: {
          top: 50,
          bottom: 50,
          left: 35
        }
      },
      title: {
        dx: isPortrait ? 310 : 410,
        dy: isPortrait ? 10 : 20,
        style: {
          fontSize: 23,
          fill: APP_THEME.APP_FONT_COLOR_DARK
        }
      },
      legend: {
        width: isPortrait ? 600 : 700,
        orientation: 'horizontal',
        itemsPerRow: isPortrait ? 2 : 3,
        gutter: isPortrait ? 100 : 50
      }
    }
  }
});
