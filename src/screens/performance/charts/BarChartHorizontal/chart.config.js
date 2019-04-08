import { APP_THEME } from '../../../../constants'

export default isPortrait => ({
  chart: {
    animate: {
      onLoad: {
        duration: 500,
        easing: 'polyInOut',
      },
    },
  },
  title: {
    textAnchor: 'middle',
    dy: 10,
  },
  bar: {
    barWidth: 25,
    cornerRadius: 2,
    horizontal: true,
    style: {
      data: {
        fill: APP_THEME.APP_BASE_COLOR_LIGHT,
      },
    },
  },
  yAxis: {
    orientation: 'left',
    label: '',
  },
  xAxis: {
    dependentAxis: true,
    orientation: 'bottom',
    style: {
      grid: {
        stroke: APP_THEME.APP_BASE_COLOR_GREY,
      },
      axis: {
        stroke: APP_THEME.APP_BASE_COLOR_WHITE,
      },
    },
  },
  chartSizes: {
    small: {
      chart: {
        width: isPortrait ? 300 : 400,
        height: 360,
        domainPadding: {
          y: [30, 30],
          x: [30, 10],
        },
        padding: {
          top: 0,
          bottom: 40,
          left: 120,
          right: 0,
        },
        label: {
          x: 125,
        },
      },
      title: {
        dy: 15,
        dx: 200,
      },
      yAxis: {
        tickLabel: {
          dy: 30,
        },
      },
    },
    large: {
      chart: {
        width: 650,
        height: 500,
        domainPadding: {
          y: [30, 30],
          x: [30, 10],
        },
        padding: {
          top: 50,
          bottom: 40,
          left: 120,
          right: 0,
        },
        label: {
          x: 125,
        },
      },
      title: {
        dx: 325,
        dy: isPortrait ? 10 : 30,
        style: {
          fontSize: 23,
          fill: APP_THEME.APP_FONT_COLOR_DARK,
        },
      },
    },
  },
})
