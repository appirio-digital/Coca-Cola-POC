import RNHTMLtoPDF from 'react-native-html-to-pdf';

export const createPDF = async options => {
  return RNHTMLtoPDF.convert(options);
};
