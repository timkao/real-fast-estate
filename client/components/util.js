export const generatePieChartSource = (properties) => {
  const typeMap = properties.reduce(function (acc, property) {
    let currentType = property.summary.proptype;
    if (currentType !== undefined) {
      if (acc[currentType] === undefined) {
        acc[currentType] = 1;
      }
      else {
        acc[currentType] += 1;
      }
    }
    return acc;
  }, {})
  const pieLabels = Object.keys(typeMap);
  const piedata = pieLabels.map(label => typeMap[label])
  return { pieLabels, piedata };
}

export const generateBarChartSource = (recentRecords, _barChoices, barType) => {
  const targetRecords = recentRecords.filter(property => {
    return property.sale.calculation.pricepersizeunit !== 0
  })
  let barChoices = targetRecords.reduce(function (acc, property) {
    const _proptype = property.summary.proptype;
    if (_barChoices.includes(_proptype) && !acc.includes(_proptype)) {
      acc.push(_proptype);
    }
    return acc;
  }, [])
  const bardataObj = targetRecords.reduce(function (acc, property) {
    const proptype = property.summary.proptype;
    if (barChoices.includes(proptype)) {
      if (acc[proptype] === undefined) {
        acc[proptype] = [property];
      }
      else {
        acc[proptype].push(property);
      }
    }
    return acc
  }, {})

  barChoices.forEach(type => {
    bardataObj[type] = bardataObj[type].sort(function (propertyA, propertyB) {
      return Date.parse(propertyA.sale.amount.salerecdate) - Date.parse(propertyB.sale.amount.salerecdate)
    })
  });

  const bardata = [];
  const timeLabels = [];
  const geoPositions = [];
  const addresses = [];
  const propIds = [];
  let barActiveDecider;
  if (bardataObj[barType]) {
    bardataObj[barType].forEach(property => {
      if (property.sale.calculation.pricepersizeunit !== 0) {
        bardata.push(property.sale.calculation.pricepersizeunit);
        timeLabels.push(property.sale.amount.salerecdate);
        geoPositions.push([property.location.latitude, property.location.longitude]);
        addresses.push(property.address.oneLine);
        propIds.push(property.identifier.obPropId);
      }
    })
    barActiveDecider = barType;
  }
  else if (barChoices.length !== 0) {
    bardataObj[barChoices[0]].forEach(property => {
      if (property.sale.calculation.pricepersizeunit !== 0) {
        bardata.push(property.sale.calculation.pricepersizeunit);
        timeLabels.push(property.sale.amount.salerecdate);
      }
    })
    barActiveDecider = barChoices[0];
  }

  const barAverage = Math.round(bardata.reduce(function (acc, num) { return acc + num }, 0) / bardata.length, 1);
  return {
    barChoices,
    bardata,
    barAverage,
    barActiveDecider,
    timeLabels,
    geoPositions,
    addresses,
    propIds
  }
}

export const generateDonutChartSource = (properties, _barChoices, _roomType) => {
  const roomType = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, ">5": 0 };
  const donutChoices = properties.reduce(function (acc, property) {
    const _proptype = property.summary.proptype;
    if (_barChoices.includes(_proptype) && !acc.includes(_proptype)) {
      acc.push(_proptype);
    }
    return acc;
  }, [])
  const _roomMap = properties.reduce(function (acc, property) {
    const currRoomType = `${property.building.rooms.beds}`;
    const proptype = property.summary.proptype;
    if (_barChoices.includes(proptype) && !acc[proptype]) {
      acc[proptype] = Object.assign({}, roomType);
      acc[proptype][currRoomType] += 1;
    }
    else if (_barChoices.includes(proptype) && acc[proptype]) {
      if (currRoomType * 1 > 5) {
        acc[proptype][">5"] += 1
      } else {
        acc[proptype][currRoomType] += 1
      }
    }
    return acc;
  }, {})
  let roomMap = {};
  let donutActiveDecider;
  if (_roomMap[_roomType]) {
    roomMap = _roomMap[_roomType];
    donutActiveDecider = _roomType;
  } else if (donutChoices.length !== 0) {
    roomMap = _roomMap[donutChoices[0]];
    donutActiveDecider = donutChoices[0];
  }

  const donutLabels = Object.keys(roomMap);
  const donutdata = donutLabels.map(label => roomMap[label])
  return {
    donutLabels,
    donutdata,
    donutActiveDecider,
    donutChoices
  }
}
