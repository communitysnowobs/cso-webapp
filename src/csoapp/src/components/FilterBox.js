import React, {Component} from 'react';

class FilterBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            startdate: "2017-10-01",
            enddate: "2018-04-30"
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
            height: '135px',
            width: '250px',
            position: 'absolute',
            top: '225px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, .9)',
            padding: '15px'
        };


        return (
            <div style={FilterBox}>
                <form>
                    <label>
                        Start Date: <input id="startdate" type="date" defaultValue={this.state.startdate} onChange={this.updateStart.bind(this)}/>
                    </label>
                    <label>
                        End Date: <input id="enddate" type="date" defaultValue={this.state.enddate} onChange={this.updateEnd.bind(this)}/>
                    </label>
                </form>
            </div>
        )
    }
}

export default FilterBox;