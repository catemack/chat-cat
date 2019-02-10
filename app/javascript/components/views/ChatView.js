import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

class ChatView extends React.Component {
    componentWillMount() {
        App.cable.subscriptions.create({ channel: "MessagesChannel", room: this.props.channelId }, {
            received(data) {
                console.log(data)
            }
        })
    }

    render() {
        if (!this.props.activeChannel) {
            return (
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" />
            )
        }

        return (
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <div className="chat-container">
                    <div className="message-container">
                        <ul>
                            {this.renderMessages()}
                        </ul>
                    </div>
                    <div className="message-input-container">
                        <input id="messageInput" type="text" className="form-control input-sm" placeholder="Type a message..." onKeyPress={(e) => this.handleKey(e)} />
                        <button type="button" onClick={() => this.submit()}><i className="material-icons">send</i></button>
                    </div>
                </div>
            </main>
        )
    }

    renderMessages() {
        return (
            <li className="clearfix">
                <div className="chat-block chat-message-icon">
                    <img src="https://www.readersdigest.ca/wp-content/uploads/sites/14/2011/01/4-ways-cheer-up-depressed-cat.jpg" className="rounded-circle" />
                </div>
                <div className="chat-block chat-message-body clearfix">
                    <div className="header">
                        <strong>Some Cat</strong>
                        <small>some time</small>
                    </div>
                    <p>
                        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa<br />
                        test<br />
                        test
                    </p>
                </div>
            </li>
        )
    }

    handleKey(e) {
        if (e.key === 'Enter') {
            this.submit()
        }
    }

    submit() {
        // axios.post('/channels/' + this.props.activeChannel + '/messages', {
        //     message: {
        //         body: document.getElementById('messageInput').value
        //     }
        // }).then(() => {

        // }).catch(() => {

        // })

        document.getElementById('messageInput').value = ''
    }
}

ChatView.propTypes = {
    activeChannel: PropTypes.number
}

export default ChatView

function Message(props) {
    return (
        <li className="clearfix">
            <div className="chat-block chat-message-icon">
                <img src="https://www.readersdigest.ca/wp-content/uploads/sites/14/2011/01/4-ways-cheer-up-depressed-cat.jpg" className="rounded-circle" />
            </div>
            <div className="chat-block chat-message-body clearfix">
                <div className="header">
                    <strong>{props.name}</strong>
                    <small>{props.timestamp}</small>
                </div>
                <p>{props.body}</p>
            </div>
        </li>
    )
}

Message.propTypes = {
    name: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    body: PropTypes.string.isRequired
}
