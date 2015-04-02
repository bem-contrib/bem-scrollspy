({
    mustDeps: [     
    ],
    shouldDeps: [
      {
        block: 'functions',
        elem: 'throttle'
      },
      {
        block: 'jquery',
        elem: 'event',
        mods: {type: 'scroll'}
      },
      {
        block: 'next-tick'
      }
    ]
})