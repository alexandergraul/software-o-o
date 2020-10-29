require 'rails_helper'
require 'vcr_helper'
require 'webmock/rspec'

RSpec.describe Appdata, type: :model, vcr: true do
  context 'openSUSE Tumbleweed Appdata' do
    it 'can be parsed' do
      appdata = Appdata.get('factory')
      pkg_list = appdata[:apps].map { |p| p[:pkgname] }.uniq

      expect(pkg_list.size).to eq(744)
      %w[4pane opera steam].each do |pkg|
        expect(pkg_list).to include(pkg)
      end
    end

  end

  context 'openSUSE Leap 15.2 Appdata' do
    it 'can be parsed' do
      appdata = Appdata.get('leap/15.2')
      pkg_list = appdata[:apps].map { |p| p[:pkgname] }.uniq

      expect(pkg_list.size).to eq(733)
      %w[0ad 4pane steam].each do |pkg|
        expect(pkg_list).to include(pkg)
      end
    end
  end

  context 'Missing Appdata' do
    it 'should not raise any exception' do
      stub_request(:get, %r{https://download.opensuse.org/tumbleweed/repo/(non-)?oss/repodata/(.*)-appdata.xml.gz})
        .to_return(status: 404, body: '', headers: {})
      appdata = Appdata.get('factory')
      expect(appdata[:apps]).to be_empty
    end
  end
end
