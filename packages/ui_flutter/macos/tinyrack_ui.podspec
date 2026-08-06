#
# The macOS half of the Tinyrack context-menu plugin. Run
# `pod lib lint tinyrack_ui.podspec` to validate it.
#
Pod::Spec.new do |s|
  s.name             = 'tinyrack_ui'
  s.version          = '0.29.0'
  s.summary          = 'System context menus for Tinyrack UI.'
  s.description      = <<-DESC
Draws TRContextMenu with AppKit so the menu carries the platform's own
appearance, keyboard navigation, and accessibility.
                       DESC
  s.homepage         = 'https://design.tinyrack.net/en/flutter/'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Tinyrack' => 'https://github.com/tinyrack-net' }

  s.source           = { :path => '.' }
  s.source_files = 'tinyrack_ui/Sources/tinyrack_ui/**/*'

  s.dependency 'FlutterMacOS'

  s.platform = :osx, '10.14'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
  s.swift_version = '5.0'
end
