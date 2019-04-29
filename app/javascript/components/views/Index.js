import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import ChannelsSidebar from './ChannelsSidebar'
import ChatView from './ChatView'
import Channel from './Channel'

const JOIN = 'JOIN'
const EXCHANGE = 'EXCHANGE'
const LEAVE = 'LEAVE'

const mediaStreamConstraints = {
    audio: true
}
const offerOptions = {
    offerToReceiveAudio: 1
}
const ice = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
}

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeChannel: -1,
            activeVoice: -1
        }
        this.pcPeers = {}
    }

    componentDidMount() {
        this.localAudio = document.getElementById('localAudio')
        this.remoteAudioContainer = document.getElementById('remoteAudioContainer')
    }

    componentWillUnmount() {
        if (this.voiceSession) {
            this.leaveVoiceChannel()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeVoice !== this.state.activeVoice && this.state.activeVoice > 0) {
            this.joinVoiceChannel(this.state.activeVoice)
        }
    }

    render() {
        let chatChannels = this.props.chatChannels.map(channel => {
            let callback = channel.type === 'VoiceChannel' ? (id => this.voiceChannelSelected(id)) : (id => this.channelSelected(id))
            return <Channel key={channel.id} channelId={channel.id} channelName={channel.name} type={channel.type}
                active={channel.id === this.state.activeChannel} callback={callback} />
        })

        return (
            <div id="main-region" className="container-fluid">
                <div className="row">
                    <ChannelsSidebar chatChannels={chatChannels} activeChannel={this.state.activeChannel}
                        selectChannelCallback={this.channelSelected.bind(this)} />
                    <ChatView activeChannel={this.state.activeChannel} />
                </div>
                <audio id="localAudio" autoPlay />
                <div id="remoteAudioContainer" />
            </div>
        )
    }

    channelSelected(id) {
        this.setState({ activeChannel: id })
    }

    voiceChannelSelected(id) {
        this.setState({ activeVoice: id })
    }

    joinVoiceChannel(id) {
        if (this.voiceSession) {
            this.leaveVoiceChannel()
        }

        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            alert('getUserMedia() is not supported by your browser')
            return
        }

        // Initialize the media stream
        navigator.mediaDevices.getUserMedia(mediaStreamConstraints).then(mediaStream => this.gotLocalMediaStream(mediaStream)).catch(error => this.handleLocalMediaStreamError(error));

        this.voiceSession = App.cable.subscriptions.create({ channel: 'VoiceChatChannel', room: id }, {
            connected: () => {
                this.broadcastData(id, { type: JOIN })
            },
            received: data => {
                if (data.from === this.props.currentUser.id) return
                switch (data.type) {
                    case JOIN:
                        return this.handleJoin(data)
                    case EXCHANGE:
                        if (data.to !== this.props.currentUser.id) return
                        return this.handleExchange(data)
                    case LEAVE:
                        return this.handleLeave(data)
                    default:
                        return
                }
            }
        })
    }

    leaveVoiceChannel() {
        this.broadcastData(this.state.activeVoice, { type: LEAVE }).then(() => {
            for (user in this.pcPeers) {
                pcPeers[user].close()
            }
            this.pcPeers = {}

            this.voiceSession.unsubscribe()
            this.remoteAudioContainer.innerHTML = ''

            this.setState({ activeVoice: -1 })
        })
    }

    broadcastData(id, data) {
        return axios.post('/channels/' + id + '/join', data)
    }

    gotLocalMediaStream(mediaStream) {
        this.localStream = mediaStream
        this.localAudio.srcObject = mediaStream
        this.localAudio.muted = true
    }

    handleLocalMediaStreamError(error) {
        console.log(error)
    }

    handleJoin(data) {
        this.createPC(data.from, true)
    }

    handleExchange(data) {
        let pc

        if (!this.pcPeers[data.from]) {
            pc = this.createPC(data.from, false)
        } else {
            pc = this.pcPeers[data.from]
        }

        if (data.candidate) {
            let candidate = JSON.parse(data.candidate)
            candidate.sdpMid = Number(candidate.sdpMid)
            pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate))).catch(error => console.log(error))
        }

        if (data.sdp) {
            let sdp = JSON.parse(data.sdp)

            if (sdp) {
                pc.setRemoteDescription(new RTCSessionDescription(sdp)).then(() => {
                    if (sdp.type === 'offer') {
                        pc.createAnswer().then(answer => {
                            pc.setLocalDescription(answer)
    
                            this.broadcastData(this.state.activeVoice, {
                                type: EXCHANGE,
                                to: data.from,
                                sdp: JSON.stringify(pc.localDescription)
                            })
                        })
                    }
                })
            }
        }
    }

    handleLeave(data) {
        let audio = document.getElementById('remoteVideo' + data.from)
        audio && audio.remove()
        delete this.pcPeers[data.from]
    }

    createPC(userId, isOffer) {
        let pc = new RTCPeerConnection(ice)
        this.pcPeers[userId] = pc
        pc.addStream(this.localStream)

        if (isOffer) {
            pc.createOffer().then(offer => {
                pc.setLocalDescription(offer)
                this.broadcastData(this.state.activeVoice, {
                    type: EXCHANGE,
                    to: userId,
                    sdp: JSON.stringify(pc.localDescription)
                })
            })
        }

        pc.onicecandidate = event => {
            if (event.candidate) {
                this.broadcastData(this.state.activeVoice, {
                    type: EXCHANGE,
                    to: userId,
                    candidate: JSON.stringify(event.candidate)
                })
            }
        }

        // pc.onaddstream = event => {
        pc.ontrack = event => {
            const element = document.createElement('video')
            element.id = 'remoteVideo' + userId
            element.autoPlay = 'autoPlay'
            element.srcObject = event.stream
            this.remoteAudioContainer.appendChild(element)
        }

        pc.oniceconnectionstatechange = event => {
            if (pc.iceConnectionState == 'disconnected') {
                this.broadcastData(this.state.activeVoice, { type: LEAVE })
            }
        }

        return pc
    }
}

Index.propTypes = {
    chatChannels: PropTypes.array,
    currentUser: PropTypes.object.isRequired
}

Index.defaultProps = {
    chatChannels: []
}

export default Index
