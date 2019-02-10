import React from 'react'
import PropTypes from 'prop-types'

class Channel extends React.Component {
    render() {
        return (
            <li>
                <a className={this.props.active ? "nav-link active" : "nav-link"} href={"/channels/" + this.props.channelId} onClick={(e) => this.handleCallback(e)}>
                    <i className="feather material-icons">{this.props.active ? "chat" : "chat_bubble_outline"}</i>
                    <span>{this.props.channelName}</span>
                </a>
            </li>
        )
    }

    handleCallback(e) {
        e.preventDefault()
        this.props.callback(this.props.channelId)
    }
}

Channel.propTypes = {
    channelId: PropTypes.number.isRequired,
    channelName: PropTypes.string.isRequired,
    active: PropTypes.bool,
    callback: PropTypes.func
}

Channel.defaultProps = {
    active: false
}

export default Channel
