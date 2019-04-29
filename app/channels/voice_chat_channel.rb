class VoiceChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for VoiceChannel.find(params[:room])
  end
end
