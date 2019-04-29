class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_for TextChannel.find(params[:room])
  end
end
