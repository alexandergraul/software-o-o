# frozen_string_literal: true

require 'open-uri'
require 'open_uri_redirections'
require 'zlib'

class Appdata
  def self.get(dist = 'factory')
    data = {}
    xml = Appdata.get_distribution(dist, 'oss')
    data = add_appdata(data, xml)
    xml = Appdata.get_distribution(dist, 'non-oss')
    data = add_appdata(data, xml)
    data
  end

  private

  def self.add_appdata(data, xml)
    data[:apps] ||= Array.new
    data[:categories] ||= Array.new
    xml.xpath("/components/component").each do |app|
      appdata = Hash.new
      # Filter translated versions of name and summary out
      appdata[:name] = app.xpath('name[not(@xml:lang)]').text
      appdata[:summary] = app.xpath('summary[not(@xml:lang)]').text
      appdata[:pkgname] = app.xpath('pkgname').text
      appdata[:categories] = app.xpath('categories/category').map(&:text).reject { |c| c.match(/^X-/) }.uniq
      appdata[:homepage] = app.xpath('url').text
      appdata[:screenshots] = app.xpath('screenshots/screenshot/image').map(&:text)
      appdata[:id] = app.xpath('id').text
      data[:apps] << appdata
    end
    data[:categories] += xml.xpath('/components/component/categories/category')
                            .map(&:text).reject { |c| c.match(/^X-/) }.uniq
    data
  end

  # Get the appdata xml for a distribution
  def self.get_distribution(distribution, flavour)
    if distribution == 'factory'
      baseurl = "https://download.opensuse.org/tumbleweed/repo/#{flavour}"
    elsif distribution.start_with?('leap')
      release = distribution[/\d.*/]
      baseurl = "https://download.opensuse.org/distribution/leap/#{release}/repo/#{flavour}"
    else
      return Nokogiri::XML('<?xml version="1.0" encoding="UTF-8"?><components origin="appdata" version="0.8"></components>')
    end

    repomd_url = "#{baseurl}/repodata/repomd.xml"
    href = Appdata.href_from_repomd(repomd_url)
    appdata_url = "#{baseurl}/#{href}"

    begin
      Nokogiri::XML(Zlib::GzipReader.new(open(appdata_url, allow_redirections: :all)))
    rescue StandardError => e
      Rails.logger.error e
      Rails.logger.error "Can't retrieve appdata from: '#{appdata_url}'"
      Nokogiri::XML('<?xml version="1.0" encoding="UTF-8"?><components origin="appdata" version="0.8"></components>')
    end
  end

  def self.href_from_repomd(url)
    repomd = Nokogiri::XML(open(url))
    repomd.remove_namespaces!
    repomd.xpath('/repomd/data[@type="appdata"]/location').attr('href').text
  end
end
