class Message < ApplicationRecord
  belongs_to :user
  belongs_to :channel, class_name: 'TextChannel'

  scope :by_channel_id, ->(channel_id) { where(channel_id: channel_id) }
  scope :by_channel, ->(channel) { by_channel_id(channel.id) }

  after_commit :broadcast_message

  def show_hash
    {
      id: id,
      user_id: user.id,
      user_name: user.email,
      channel_id: channel_id,
      body: body,
      created_at: created_at,
      updated_at: updated_at
    }
  end

  private

  def broadcast_message
    MessagesChannel.broadcast_to(channel, show_hash)
  end
end
