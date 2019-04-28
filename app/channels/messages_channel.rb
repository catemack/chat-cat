class MessagesChannel < ApplicationCable::Channel
  def subscribed
    logger.warn "params : #{params}"
    stream_for Channel.find(params[:room])
  end
end
