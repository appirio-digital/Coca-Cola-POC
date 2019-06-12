import React, { PureComponent, Component } from "react";
import MapView from "react-native-maps";
import { View, Text, StyleSheet } from "react-native";
import { APP_THEME, APP_FONTS } from "../../../constants";

class Map extends Component {
  state = {
    areAllPointsReady: false,
    allPoints: [],
    polyline_points: []
  };
  map = null;
  markers = [];

  componentDidUpdate(prevProps) {
    const {
      origin,
      destination,
      waypoints,
      polyline_points
    } = this.props.locations;

    if (origin.coordinate && !prevProps.locations.origin.coordinate) {
      if (this.map) {
        this.map.animateToCoordinate(origin.coordinate, 250);
      }
    }

    if (
      origin.coordinate &&
      destination.coordinate &&
      waypoints.length > 0 &&
      waypoints[0].coordinate &&
      polyline_points.length > 0 &&
      prevProps.locations.polyline_points.length === 0
    ) {
      this.onDirectionReady([
        origin.coordinate,
        ...waypoints.map(point => point.coordinate),
        destination.coordinate
      ]);
    }
  }

  componentWillUnmount() {
    // Unmounting map object
    this.map = null;
    this.markers = [];
  }

  onDirectionReady = result => {
    if (this.map) {
      this.map.fitToCoordinates(result, {
        animated: true,
        edgePadding: {
          right: 50,
          bottom: 50,
          left: 50,
          top: 50
        }
      });
    }
  };

  onCalloutClicked(e, index) {
    e.stopPropagation();

    const marker = this.markers[index];

    if (marker) {
      marker.hideCallout();
    }
  }
  renderMarker = (areAllPointsReady, allPoints) => {
    if (areAllPointsReady) {
      return allPoints.map((point, index) => {
        const {
          activity: { AccountName, AccountAddress },
          coordinate
        } = point;
        return (
          <MapView.Marker
            key={index}
            ref={marker => (this.markers[index] = marker)}
            title={AccountName}
            description={AccountAddress}
            coordinate={coordinate}
            onPress={() =>
              this.props.locationsActions.setSelectedPoint({ point, index })
            }
          >
            {this.renderCallout(point, index)}
          </MapView.Marker>
        );
      });
    }
  };

  renderCallout = (point, index) => {
    const { Subject, AccountAddress, AccountName = null } = point.activity;
    return (
      <MapView.Callout
        tooltip={false}
        onPress={e => this.onCalloutClicked(e, index)}
      >
        <Text style={styles.calloutAccountName}>
          {AccountName && AccountName}
        </Text>
        <Text style={styles.calloutAccountNumber}>{Subject}</Text>
        <Text style={styles.calloutAddress}>{AccountAddress}</Text>
      </MapView.Callout>
    );
  };

  renderPolyline = (areAllPointsReady, polyline_points) => {
    if (areAllPointsReady) {
      return (
        <MapView.Polyline
          coordinates={polyline_points}
          strokeWidth={3}
          strokeColor="#0E68FF"
        />
      );
    }
  };

  componentWillReceiveProps(props) {
    const {
      origin,
      destination,
      waypoints,
      polyline_points,
      error
    } = props.locations;
    const allPoints = [origin, ...waypoints, destination];

    const areAllPointsReady =
      allPoints.filter(point => !point.coordinate).length === 0 &&
      polyline_points.length > 0 &&
      !error;

    this.setState({ areAllPointsReady, allPoints, polyline_points });

    const allPointsCoordinate = allPoints
      .map(point => {
        if (point.coordinate) {
          return point.coordinate;
        }
      })
      .filter(coordinate => {
        return coordinate != undefined;
      });
    if (allPointsCoordinate && allPointsCoordinate.length > 0) {
      this.onDirectionReady(allPointsCoordinate);
    }
  }

  render() {
    const { areAllPointsReady, allPoints, polyline_points } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={ref => (this.map = ref)}
          provider={MapView.PROVIDER_GOOGLE}
          style={{ flex: 1 }}
        >
          {this.renderMarker(areAllPointsReady, allPoints)}
          {this.renderPolyline(areAllPointsReady, polyline_points)}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calloutAccountName: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16
  },
  calloutAccountNumber: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 15
  },
  calloutAddress: {
    color: APP_THEME.APP_LIST_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: 15
  }
});

export default Map;
