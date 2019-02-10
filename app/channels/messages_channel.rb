class MessagesChannel < ApplicationCable::Channel
    def subscribed
        stream_from Channel.find(params[:id])
    end
end
