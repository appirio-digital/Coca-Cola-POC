import { AsyncStorage } from 'react-native'
import moment from 'moment'

import { ASYNC_STORAGE_SYNC_DATE_KEY } from '../constants'

const handleActivitiesDebounce = null

export const fetchAndHandleTodaysActivities = (deviceLocation, props) => {
  handleActivitiesDebounce = setTimeout(async () => {
    const {
      createNotification,
      customers: {
        todaysActivities,
        todaysActivitiesUpdatedAt,
      },
      customersActions: {
        getTodaysActivities,
        notifyUserWhenNearActivity,
      },
      sync: {
        isSyncing,
      },
      navigation,
    } = props
    const lastSyncDate = await AsyncStorage.getItem(ASYNC_STORAGE_SYNC_DATE_KEY)
    
    // Activities were not fetched or activities data was one day old
    if ((
      !todaysActivitiesUpdatedAt
      || moment().diff(moment(todaysActivitiesUpdatedAt), 'days') > 1)
      && !isSyncing
      && lastSyncDate
    ) {
      getTodaysActivities()
    } else if (todaysActivities && todaysActivities.length > 0) {
      notifyUserWhenNearActivity(
        todaysActivities,
        deviceLocation,
        createNotification,
        distanceBetweenTwoPoints,
        navigation,
      )
    }
    clearTimeout(handleActivitiesDebounce)
  }, 1000)
}

/**
 * Source: https://github.com/manuelbieh/Geolib/blob/master/src/geolib.js#L237
 * Calculates geodetic distance between two points specified by latitude/longitude using
 * Vincenty inverse formula for ellipsoids
 * Vincenty Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2010
 * (Licensed under CC BY 3.0)
 *
 * @param    object    Start position {latitude: 123, longitude: 123}
 * @param    object    End position {latitude: 123, longitude: 123}
 * @return   integer   Distance (in meters)
 */
export const distanceBetweenTwoPoints = (start, end) => {
  const accuracy = 0.00001
  const precision = 0

  let a = 6378137,
    b = 6356752.314245,
    f = 1 / 298.257223563 // WGS-84 ellipsoid params
  const L = toRadius(end.longitude - start.longitude)

  let cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM, sinSigma

  const U1 = Math.atan((1 - f) * Math.tan(toRadius(parseFloat(start.latitude))))
  const U2 = Math.atan((1 - f) * Math.tan(toRadius(parseFloat(end.latitude))))
  let sinU1 = Math.sin(U1),
    cosU1 = Math.cos(U1)
  let sinU2 = Math.sin(U2),
    cosU2 = Math.cos(U2)

  let lambda = L,
    lambdaP,
    iterLimit = 100
  do {
    let sinLambda = Math.sin(lambda),
      cosLambda = Math.cos(lambda)
    sinSigma = Math.sqrt(
      cosU2 * sinLambda * (cosU2 * sinLambda) +
      (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
    )

    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda
    sigma = Math.atan2(sinSigma, cosSigma)
    sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma
    cosSqAlpha = 1 - sinAlpha * sinAlpha
    cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha

    if (isNaN(cos2SigmaM)) {
      cos2SigmaM = 0 // equatorial line: cosSqAlpha=0 (§6)
    }
    const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
    lambdaP = lambda
    lambda =
      L +
      (1 - C) *
      f *
      sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))
  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0)

  if (iterLimit === 0) {
    return NaN // formula failed to converge
  }

  const uSq = cosSqAlpha * (a * a - b * b) / (b * b)

  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))

  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

  const deltaSigma =
    B *
    sinSigma *
    (cos2SigmaM +
      B /
      4 *
      (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
        B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)))

  let distance = b * A * (sigma - deltaSigma)

  distance = distance.toFixed(precision) // round to 1mm precision

  return (this.distance =
    Math.round(distance * Math.pow(10, precision) / accuracy) * accuracy / Math.pow(10, precision))
}

const toRadius = number => number * Math.PI / 180
