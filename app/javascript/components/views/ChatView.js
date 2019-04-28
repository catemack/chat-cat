import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

class ChatView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        if (this.props.activeChannel && this.props.activeChannel > 0) {
            this.subscription = App.cable.subscriptions.create({ channel: "MessagesChannel", room: this.props.channelId }, {
                received(data) {
                    messages = this.state.messages
                    messages.push(data)
                    messages.sort((a, b) => {
                        if (a.created_at < b.created_at) {
                            return -1
                        }
                        if (a.created_at > b.created_at) {
                            return 1
                        }
                        return 0
                    })
                    this.setState({messages: messages})
                }
            })
        }
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.activeChannel != prevProps.activeChannel) {
            this.unsubscribe()
            this.subscribe()
        }

        if (this.state.messages.length != prevState.messages.length) {
            let element = document.getElementById('messageContainer')
            element.scrollTop = element.scrollHeight
        }
    }

    render() {
        if (!this.props.activeChannel || this.props.activeChannel < 1) {
            return (
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" />
            )
        }

        return (
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <div className="chat-container">
                    <div id="messageContainer" className="message-container">
                        {this.renderMessages()}
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
        let messages = this.state.messages.map(message => {
            return <Message key={message.id} id={message.id} user_id={message.user_id} user_name={message.user_name}
                body={message.body} created_at={message.created_at} updated_at={message.updated_at} />
        })

        return <ul>{messages}</ul>
    }

    handleKey(e) {
        if (e.key === 'Enter') {
            this.submit()
        }
    }

    submit() {
        axios.post('/channels/' + this.props.activeChannel + '/messages', {
            message: {
                body: document.getElementById('messageInput').value
            }
        }).then(() => {

        }).catch(() => {

        })

        document.getElementById('messageInput').value = ''
    }

    subscribe() {
        this.subscription = App.cable.subscriptions.create({ channel: "MessagesChannel", room: this.props.activeChannel }, {
            received: (data) => {
                let messages = this.state.messages
                messages.push(data)
                messages.sort((a, b) => {
                    if (a.created_at < b.created_at) {
                        return -1
                    }
                    if (a.created_at > b.created_at) {
                        return 1
                    }
                    return 0
                })
                this.setState({messages: messages})
            }
        })

        axios.get('/channels/' + this.props.activeChannel + '/messages').then(response => {
            this.setState({messages: response.data})
        })
    }

    unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe()
            this.setState({messages: []})
            delete this.subscription
        }
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
                    <strong>{props.user_name}</strong>
                    <small>{props.created_at}</small>
                </div>
                <p>{props.body}</p>
            </div>
        </li>
    )
}

Message.propTypes = {
    id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    user_name: PropTypes.string.isRequired,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    body: PropTypes.string.isRequired
}
