const schedulingInfo = {
    schedulingOn: false,
    schedulingData: []
};

const reducer = (state = schedulingInfo, action) => {
    switch (action.type) {
      case 'SCHEDULE_UPDATE':
        return action.data;    
      default:
        return state;
    }
  };
  
  export default reducer;