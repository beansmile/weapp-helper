module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        "modules": false,
        'targets': {
          'browsers': [
            'last 2 versions',
            'safari >= 8'
          ]
        }
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': false,
        'helpers': true,
        'regenerator': false,
        'useESModules': false
      }
    ],
    '@babel/plugin-proposal-class-properties',
  ]
}
