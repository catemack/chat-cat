class TextChannel < Channel
  has_many :messages, dependent: :destroy
end
