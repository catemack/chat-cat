import React from 'react'
import PropTypes from 'prop-types'

import ChannelsSidebar from './ChannelsSidebar'
import ChatView from './ChatView'
import Channel from './Channel'

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = { activeChannel: -1 }
    }

    render() {
        let chatChannels = this.props.chatChannels.map(channel => {
            return <Channel key={channel.id} channelId={channel.id} channelName={channel.name}
                active={channel.id === this.state.activeChannel} callback={id => this.channelSelected(id)} />
        })

        return (
            <div id="main-region" className="container-fluid">
                <div className="row">
                    <ChannelsSidebar chatChannels={chatChannels} activeChannel={this.state.activeChannel}
                        selectChannelCallback={this.channelSelected.bind(this)} />
                    <ChatView activeChannel={this.state.activeChannel} />
                </div>
            </div>
        )
    }

    channelSelected(id) {
        this.setState({ activeChannel: id })
    }
}

ChannelsSidebar.propTypes = {
    chatChannels: PropTypes.array
}

ChannelsSidebar.defaultProps = {
    chatChannels: []
}

export default Index
