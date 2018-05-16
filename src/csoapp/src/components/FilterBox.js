import React, {Component} from 'react';

class FilterBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            startdate: props.start_date,
            enddate: props.end_date
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        console.log(event);
        event.preventDefault();
    }

    updateStart(event){
        this.setState({
            startdate: event.target.value,
        })
    }

    updateEnd(event) {
        this.setState({
            enddate: event.target.value,
        })
    }

    render() {
        const FilterBox = {
            height: '200px',
            width: '250px',
            position: 'absolute',
            top: '225px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, .9)',
            padding: '15px'
        };


        return (
            <div style={FilterBox}>
                <p>Snow observations date range</p>
                <form>
                    <label>
                        Start Date: <input id="startdate" type="date" defaultValue={this.state.startdate} onChange={this.updateStart.bind(this)} readOnly/>
                    </label>
                    <label>
                        End Date: <input id="enddate" type="date" defaultValue={this.state.enddate} onChange={this.updateEnd.bind(this)} readOnly/>
                    </label>
                </form>
            </div>
        )
    }
}

export default FilterBox;