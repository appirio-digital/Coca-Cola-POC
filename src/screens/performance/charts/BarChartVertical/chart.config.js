import { APP_THEME } from '../../../../constants';

export default isPortrait => ({
  chart: {
    animate: {
      onLoad: {
        duration: 500,
        easing: 'polyInOut'
      }
    }
  },
  title: {
    textAnchor: 'middle',
    dy: 10
  },
  bar: {
    alignment: 'start',
    cornerRadius: 2,
    style: {
      data: {
        fill: APP_THEME.APP_BASE_COLOR_DARK
      }
    },
    label: {
      style: {
        fill: APP_THEME.APP_BASE_COLOR_WHITE
      }
    }
  },
  yAxis: {
    dependentAxis: true,
    fixLabelOverlap: true,
    orientation: 'left',
    label: {
      dy: -10
    },
    style: {
      grid: {
        stroke: APP_THEME.APP_BASE_COLOR_GREY
      }
    }
  },
  xAxis: { height: 150 },
  chartSizes: {
    small: {
      chart: {
        width: isPortrait ? 310 : 420,

        padding: {
          top: 30,
          bottom: 20,
          left: 50,
          right: 10
        },
        domainPadding: {
          x: [30, 30]
        }
      },
      title: {
        dy: 15,
        dx: 200
      },
      bar: {
        barWidth: 10,
        label: {
          dx: 5,
          y: 227,

          style: {
            fill: APP_THEME.APP_BASE_COLOR_WHITE,
            fontSize: 12
          }
        }
      },
      legend: {
        width: isPortrait ? 310 : 420,
        orientation: 'vertical',
        itemsPerRow: 2,
        gutter: 12
      },
      xAxis: {
        tickLabel: {
          dx: 0,
          dy: 2,
          textAnchor: 'end'
        },
        style: {
          tickLabels: {
            angle: -90
          }
        }
      }
    },
    large: {
      chart: {
        width: isPortrait ? 650 : 700,

        padding: {
          top: isPortrait ? 50 : 70,
          bottom: 40,
          left: 50,
          right: 50
        },
        domainPadding: {
          x: 10
        }
      },
      title: {
        dx: 325,
        dy: isPortrait ? 10 : 30,
        style: {
          fontSize: 23,
          fill: APP_THEME.APP_FONT_COLOR_DARK
        }
      },
      bar: {
        barWidth: 30,
        label: {
          dx: 15,
          y: isPortrait ? 630 : 530,
          style: {
            fill: APP_THEME.APP_BASE_COLOR_WHITE
          }
        }
      },

      legend: {
        width: isPortrait ? 600 : 700,
        orientation: 'horizontal',
        itemsPerRow: isPortrait ? 2 : 3,
        gutter: isPortrait ? 100 : 50
      },
      xAxis: {
        height: 150,
        tickLabel: {
          dx: 0,
          dy: 2,
          textAnchor: 'end'
        },

        style: {
          tickLabels: {
            angle: -90
          }
        }
      }
    }
  }
});
