const InCheck = (state = false, action) => {  
  switch (action.type) {
    case 'UPDATE_IN_CHECK':
      return action.bool

    default:
      return state;
  }
}
export default InCheck;