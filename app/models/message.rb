class Message < ApplicationRecord
  belongs_to :user
  belongs_to :channel

  scope :by_channel_id, ->(channel_id) { where(channel_id: channel_id) }
  scope :by_channel, ->(channel) { by_channel_id(channel.id) }
end
