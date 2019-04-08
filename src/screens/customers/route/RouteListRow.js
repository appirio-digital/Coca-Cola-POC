import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image
} from 'react-native';
import { APP_FONTS, APP_THEME, ACTIVITY_STATUS_LOV } from '../../../constants';
import { formatDate, formatDateWithTime } from '../../../utility';
import { labels } from '../../../stringConstants';
import isEmpty from 'lodash/isEmpty';
const RouteListRow = props => {
  const {
    item: { AccountName, subject, statuscode, enddate, startdate, id },
    checkInId,
    isStartingDay,
    noVisitInprogress
  } = props;

  const visited = statuscode == ACTIVITY_STATUS_LOV.COMPLETE ? true : false;
  const inVisit = statuscode == ACTIVITY_STATUS_LOV.IN_PROGRESS ? true : false;
  //console.log('checkInId from props', props);
  let isCheckINCheckOutDisable = false;
  if (!isStartingDay && isEmpty(checkInId)) {
    isCheckINCheckOutDisable = true;
  } else {
    if (!isNaN(checkInId) && id == checkInId) {
      isCheckINCheckOutDisable = false;
    } else if (!isEmpty(checkInId) && id != checkInId) {
      isCheckINCheckOutDisable = true;
    } else {
      isCheckINCheckOutDisable = noVisitInprogress ? false : true;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.iconContainer}>
          <Text
            style={[
              styles.iconText,
              {
                color: visited
                  ? APP_THEME.APP_LIST_BORDER_COLOR
                  : inVisit
                    ? APP_THEME.APP_FONT_COLOR_ORANGE
                    : APP_THEME.APP_BASE_COLOR
              }
            ]}
          >
            
          </Text>
          <Image
            style={styles.iconContainerImage}
            source={require('../../../images/dashed-line.png')}
          />
        </View>
        <View style={styles.textItemContainer}>
          <Text style={styles.itemTextCode}>{subject}</Text>
          <Text style={styles.itemText}>{AccountName}</Text>
          <Text style={styles.itemTextDate}>
            {formatDateWithTime(startdate)} - {formatDateWithTime(enddate)}
          </Text>
        </View>
        <View
          style={{ flex: 1, maxWidth: 160, paddingTop: 20, paddingBottom: 20 }}
        >
          <TouchableOpacity
            disabled={isCheckINCheckOutDisable}
            style={[
              isCheckINCheckOutDisable
                ? styles.headerButtonDisable
                : styles.headerButton,
              {
                backgroundColor: visited
                  ? APP_THEME.APP_LIST_BORDER_COLOR
                  : inVisit
                    ? APP_THEME.APP_FONT_COLOR_ORANGE
                    : APP_THEME.APP_BASE_COLOR
              }
            ]}
            onPress={() => props.onPressed(props.item)}
          >
            <Text style={styles.headerButtonText}>
              {visited
                ? labels.COMPLETE
                : statuscode == ACTIVITY_STATUS_LOV.IN_PROGRESS
                  ? labels.CHECKOUT
                  : labels.CHECKIN}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RouteListRow;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  iconContainer: {
    width: 30,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconContainerImage: {
    flex: 1,
    alignItems: 'center',
    resizeMode: 'center'
  },
  textItemContainer: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5
  },
  itemTextCode: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 12,
    lineHeight: 15
  },
  itemText: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,

    fontSize: 14,
    lineHeight: 18
  },
  itemTextDate: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,

    fontSize: 14,
    lineHeight: 18
  },
  iconText: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 24
  },
  headerText: {
    flex: 1,
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_BOLD,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headerButton: {
    flex: 1,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  },
  headerButtonText: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  headerButtonDisable: {
    flex: 1,
    height: 40,
    opacity: 0.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  }
});
