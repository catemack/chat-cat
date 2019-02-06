class CreateChannels < ActiveRecord::Migration[5.2]
  def change
    create_table :channels do |t|
      t.text :name, unique: true, null: false

      t.timestamps
    end
  end
end
