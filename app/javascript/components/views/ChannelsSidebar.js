import React from 'react'
import PropTypes from 'prop-types'

class ChannelsSidebar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeChannel: -1
        }
    }

    render() {
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>Chat Channels</span>
                    </h6>

                    <ul className="nav flex-column">
                        {this.renderChannels()}
                    </ul>
                </div>
            </nav>
        )
    }

    renderChannels() {
        return this.props.chatChannels.map(channel => (
            <Channel key={channel.id} name={channel.name} active={channel.id === this.state.activeChannel} onClick={e => this.setActiveChannel(e, channel.id)} />
        ))
    }

    setActiveChannel(e, id) {
        e.preventDefault()
        this.setState({ activeChannel: id })
    }
}

ChannelsSidebar.propTypes = {
    chatChannels: PropTypes.array.isRequired
}

export default ChannelsSidebar

function Channel(props) {
    return (
        <li>
            <a className={props.active ? "nav-link active" : "nav-link"} href={"/channels/" + props.id}>
                <i className="feather material-icons">{props.active ? "chat" : "chat_bubble_outline"}</i>
                <span>{props.name}</span>
            </a>
        </li>
    )
}
