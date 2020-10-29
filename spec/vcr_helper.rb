require 'vcr'

VCR.configure do |c|
  c.cassette_library_dir = Rails.root.join('test', 'support', 'vcr')
  c.default_cassette_options = { record: :new_episodes }
  c.ignore_localhost = true
  username = Rails.configuration.x.api_username
  password = Rails.configuration.x.api_password
  c.filter_sensitive_data('<API USERNAME>') { username }
  c.filter_sensitive_data('<API HTTP AUTH>') { Base64.encode64("#{username}:#{password}").strip }
  c.hook_into :webmock
  c.configure_rspec_metadata!
end
