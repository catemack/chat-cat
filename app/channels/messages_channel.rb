class MessagesChannel < ApplicationCable::Channel
  def subscribed
    logger.warn "params : #{params}"
    stream_for TextChannel.find(params[:room])
  end
end
