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
        block: 'next-tick'
      }
    ]
});
