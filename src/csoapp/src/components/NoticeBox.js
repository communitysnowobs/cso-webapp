import React from 'react';

const NoticeBox = () => {
    const infoBox = {
        height: '110px',
        width: '400px',
        position: 'absolute',
        top: '80px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, .9)',
        padding: '15px'
    };

    return (
        <div style={infoBox}>
            <p><strong>Note:</strong> Data collected from the Mountain Hub app will be displayed on
                this map shortly after you collect observations. Check back here as the project progresses!</p>
        </div>
    )
};

export default NoticeBox;