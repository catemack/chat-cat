class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :load_channel, only: [:index, :create]
  before_action :load_messages, only: :index
  before_action :load_message, only: [:update, :delete]
  before_action :validate_ownership, only: [:update, :delete]

  def index
  end

  def create
    @message = Message.new(message_params)
    @message.user = current_user
    @message.channel = @channel

    @message.save!
  end

  def update
    @message.assign_attributes(message_params)
    @message.save!
  end

  def delete
    @message.destroy!
  end

  private

  def load_channel
    @channel = Channel.find(params[:channel_id])
  end

  def load_messages
    @messages = Message.by_channel(@channel)
  end

  def load_message
    @message = Message.find(params[:id])
  end

  def validate_ownership
    head :forbidden unless @message.user == current_user
  end

  def message_params
    params.require(:message).permit(:body)
  end
end
