class ChannelsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!

  before_action :load_channel, only: [:show, :join]

  def index
  end

  def show
  end

  def join
    head :bad_request and return unless @channel.is_a? VoiceChannel

    head :no_content
    VoiceChatChannel.broadcast_to(@channel, join_voice_params)
  end

  private

  def load_channel
    @channel = VoiceChannel.find(params[:id])
  end

  def join_voice_params
    params.permit(:type, :to, :sdp, :candidate).merge({ from: current_user.id })
  end
end
