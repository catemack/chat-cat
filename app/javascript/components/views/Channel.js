import React from 'react'
import PropTypes from 'prop-types'

class Channel extends React.Component {
    render() {
        let icon = 'chat_bubble_outline'
        if (this.props.type === 'VoiceChannel') {
            icon = 'volume_up'
        } else if (this.props.active) {
            icon = 'chat'
        }

        return (
            <li>
                <a className={this.props.active ? "nav-link active" : "nav-link"} href={"/channels/" + this.props.channelId} onClick={(e) => this.handleCallback(e)}>
                    <i className="feather material-icons">{icon}</i>
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
    type: PropTypes.string.isRequired,
    active: PropTypes.bool,
    callback: PropTypes.func
}

Channel.defaultProps = {
    active: false
}

export default Channel
