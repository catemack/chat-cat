class Channel < ApplicationRecord
  has_many :messages, dependent: :destroy

  validates :name, uniqueness: true
end
