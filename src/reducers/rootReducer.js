const blockInfo = {
    schedulingOn: false,
    siteList: [],
    schedulingData: [
      { name: "Sunday", enabled: false, startTime: '12:00 AM', endTime: '11:59 PM', startTimeUnencoded: null, endTimeUnencoded: null },
      { name: "Monday", enabled: false, startTime: '12:00 AM', endTime: '11:59 PM', startTimeUnencoded: null, endTimeUnencoded: null },
      { name: "Tuesday", enabled: false, startTime: '12:00 AM', endTime: '11:59 PM', startTimeUnencoded: null, endTimeUnencoded: null },
      { name: "Wednesday", enabled: false, startTime: '12:00 AM', endTime: '11:59 PM', startTimeUnencoded: null, endTimeUnencoded: null },
      { name: "Thursday", enabled: false, startTime: '12:00 AM', endTime: '11:59 PM', startTimeUnencoded: null, endTimeUnencoded: null },
      { name: "Friday", enabled: false, startTime: '12:00 AM', endTime: '11:59 PM', startTimeUnencoded: null, endTimeUnencoded: null },
      { name: "Saturday", enabled: false, startTime: '12:00 AM', endTime: '11:59 PM', startTimeUnencoded: null, endTimeUnencoded: null }
    ]
};

const reducer = (state = blockInfo, action) => {
  switch (action.type) {
      case 'SCHEDULE_UPDATE':
        return Object.assign({}, state, action.data);    
      case 'SITE_LIST_UPDATE':
        return Object.assign({}, state, action.data);   
      default:
        return state;
    }
  };
  
  export default reducer;