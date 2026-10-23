Pod::Spec.new do |s|
  s.name           = 'PaceBuddy'
  s.version        = '1.0.0'
  s.summary        = 'Ponte do Pace Buddy com o despertador do iPhone'
  s.description    = 'Liga o app ao despertador do Pace Buddy (AlarmKit, iOS 26).'
  s.author         = 'PACE TEAM'
  s.homepage       = 'https://paceteam.app'
  s.license        = 'UNLICENSED'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,swift}"
end
