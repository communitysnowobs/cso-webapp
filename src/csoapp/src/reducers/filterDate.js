const initState = {
    start_date: "2017-10-01",
    end_date: "2018-04-30"
};

const filterDate = (state = initState, action) => {
    switch (action.type) {
        case 'FILTER_DATE':
            return action.dates;
        default:
            return state
    }
}
​
export default filterDate