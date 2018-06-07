import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand"
                           href="http://communitysnowobs.org"
                           title="CommunitySnowObs">
                            <img className="nav-img"
                                 src="https://i1.wp.com/nasacso.s3-us-west-2.amazonaws.com/wp-content/uploads/2017/02/27215912/Logo_websiteSimple1.jpg?fit=1024%2C721"></img>
                        </a>
                        <span className="navbar-brand title">Community Snow Observations</span>
                    </div>

                </div>
            </nav>
        );
    }
}

export default Navbar;
