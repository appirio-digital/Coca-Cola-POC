import XMLParser from 'react-xml-parser';
export const callOPA = accountCode =>
  new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.withCredentials = true;
    xmlhttp.open(
      'POST',
      'https://rnowopa0117--tst1.custhelp.com:443/determinations-server/assess/soap/generic/12.2.1/PromotionsPolicies',
      true
    );

    // build SOAP request
    var sr =
      '<?xml version="1.0" encoding="utf-8"?>' +
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://oracle.com/determinations/server/12.2.1/rulebase/assess/types">' +
      '<soapenv:Header/>' +
      '<soapenv:Body>' +
      '<typ:assess-request>' +
      '<typ:config>' +
      '<typ:outcome>' +
      '<typ:entity id="global">' +
      '<typ:attribute-outcome id="bac4de28-c2af-4db8-83d6-7d8f3a06f77f" outcome-style="value-only"/>' +
      '</typ:entity>' +
      '</typ:outcome>' +
      '</typ:config>' +
      '<typ:global-instance>' +
      '<typ:attribute id="accountId" type="text">' +
      '<typ:text-val>' +
      accountCode +
      '</typ:text-val>' +
      '</typ:attribute>' +
      '</typ:global-instance>' +
      '</typ:assess-request>' +
      '</soapenv:Body>' +
      '</soapenv:Envelope>';

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          const xmlDoc = new XMLParser().parseFromString(
            xmlhttp.responseText,
            'text/xml'
          );
          var value = xmlDoc.getElementsByTagName('typ:boolean-val');
          resolve(value);
        } else {
          reject(xmlhttp.statusText);
        }
      }
    };
    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.setRequestHeader(
      'SOAPAction',
      'http://oracle.com/determinations/server/12.2.1/rulebase/types/Assess'
    );
    xmlhttp.send(sr);
  });
