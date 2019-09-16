function testBuilCommand() {
    // return;
    var data = [
      {
        id: '0',
        text: '0',
        elements: [
          {
            id: '0-0',
            text: '0-0',
            elements: []
          },
          {
            id: '0-1',
            text: '0-1',
            elements: [
              {
                id: '0-0-0',
                text: '0-0-0',
                elements: []
              },
              {
                id: '0-0-1',
                text: '0-0-1',
                elements: []
              },
              {
                id: '0-0-2',
                text: '0-0-2',
                elements: []
              }
            ]
          }
        ]
      },
      {
        id: '1',
        text: '1',
        elements: [
          {
            id: '1-0',
            text: '1-0',
            elements: []
          },
          {
            id: '1-1',
            text: '1-1',
            elements: [
              {
                id: '1-0-0',
                text: '1-0-0',
                elements: []
              },
              {
                id: '1-0-1',
                text: '1-0-1',
                elements: []
              },
              {
                id: '1-0-2',
                text: '1-0-2',
                elements: []
              }
            ]
          }
        ]
      }
    ];
    const command1 = buildCommand([0, 1, 1], i => ({ $splice: [[i, 1]] }));
    const command2 = buildCommand([1, 1, 0], i => ({
      $splice: [[i, 0, { id: '0-0-t', text: '0-0-t' }]]
    }));
    data = update(data, command1);
    data = update(data, command2);
    //   console.log('testBuildCommand', JSON.stringify(data, null, 2));
  }