import React from 'react'
import PropTypes from 'prop-types'

class ChannelsSidebar extends React.Component {
    render() {
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>Chat Channels</span>
                    </h6>

                    <ul className="nav flex-column">
                        {this.props.chatChannels}
                    </ul>
                </div>
            </nav>
        )
    }
}

ChannelsSidebar.propTypes = {
    chatChannels: PropTypes.array
}

ChannelsSidebar.defaultProps = {
    chatChannels: []
}

export default ChannelsSidebar
