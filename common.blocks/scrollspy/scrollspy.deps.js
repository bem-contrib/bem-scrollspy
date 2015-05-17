({
    mustDeps: [
      {
        block: 'i-bem',
        elems: ['dom']
      }
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
