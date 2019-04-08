import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../../constants';
import { labels } from '../../../../stringConstants';

class CreditNotesRow extends PureComponent {
  getStatusColor = status => {
    switch (status) {
      case 'Unpaid':
        return '#05A079';
      case 'Paid':
        return '#F5A623';
      default:
        return '#86898E';
    }
  };
  render() {
    const {
      isChecked,
      InvoiceId,
      InvoiceNumber,
      Amount,
      Date,
      Balance,
      Statue,
      CreditNotes
    } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            paddingRight: 5,
            paddingLeft: 5
          }}
        >
          <TouchableOpacity style={styles.buttonStyle} onPress={() => {}}>
            <Text style={styles.checkBoxStyle}>
              {isChecked === true ? '' : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            paddingRight: 5,
            paddingLeft: 5
          }}
        >
          <Text style={[styles.textBaseStyle]}>{CreditNotes}</Text>
        </View>
        <Text style={[styles.textBaseStyle]}>{Date}</Text>

        <Text style={[styles.textBaseStyle]}>{Amount}</Text>

        <Text style={styles.textBaseStyle}>{Balance}</Text>

        <Text
          style={[styles.textBaseStyle, { color: this.getStatusColor(Statue) }]}
        >
          {Statue}
        </Text>
      </View>
    );
  }
}

export default CreditNotesRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  },

  textBaseStyle: {
    flex: 1,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: APP_THEME.APP_LIST_FONT_COLOR
  },
  checkBoxTextStyle: {
    alignSelf: 'center',
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16
  },
  checkBoxStyle: {
    alignSelf: 'center',
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 24,
    paddingRight: 10
  },
  buttonStyle: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  }
});
