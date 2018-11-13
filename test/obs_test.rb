require 'test_helper'

class OBSTest < ActiveSupport::TestCase
  test 'search binaries data structure' do
    VCR.use_cassette('default') do
      binaries = OBS.search_published_binary('vcpkg', baseproject: 'openSUSE:Factory')

      assert_equal 2, binaries.size
      assert_equal "", binaries.first.quality
    end
  end

  test 'search fileinfo for one Binary' do
    VCR.use_cassette('default') do
      binary = OBS::Binary.new(
        'project' => 'home:dmacvicar',
        'repository' => 'openSUSE_Tumbleweed',
        'arch' => 'x86_64',
        'filename' => 'vcpkg-0.0+git.1524688133.90be0d9b-9.6.x86_64.rpm'
      )
      fileinfo = OBS.search_published_binary_fileinfo(binary)

      assert_equal "C++ library manager for Linux, macOS and Windows", fileinfo.summary
    end
  end
end
