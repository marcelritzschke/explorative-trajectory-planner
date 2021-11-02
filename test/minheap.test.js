const MinHeap = require('../utils/minheap').MinHeap;

test('heap_with_0_element', () => {
  const minHeap = new MinHeap();
  expect(minHeap.peek()).toBeUndefined();
  expect(minHeap.pop()).toBeUndefined();
  expect(minHeap.peek()).toBeUndefined();
});

test('heap_with_1_element', () => {
  const minHeap = new MinHeap();
  expect(minHeap.isEmpty()).toBeTruthy();
  minHeap.push(1);
  expect(minHeap.isEmpty()).toBeFalsy();
  expect(minHeap.peek()).toEqual(1);
  expect(minHeap.pop()).toEqual(1);
  expect(minHeap.peek()).toBeUndefined();
});

test('heap_with_many_elements_0', () => {
  const minHeap = new MinHeap();
  minHeap.push(2);
  minHeap.push(3);
  minHeap.push(1);
  expect(minHeap.peek()).toEqual(1);
});

test('heap_with_many_elements_1', () => {
  const minHeap = new MinHeap();
  minHeap.push(1);
  minHeap.push(2);
  minHeap.push(3);
  minHeap.push(4);
  minHeap.push(5);
  minHeap.push(6);
  minHeap.push(7);
  minHeap.push(8);
  minHeap.push(9);
  expect(minHeap.peek()).toEqual(1);
});

test('heap_with_many_elements_2', () => {
  const minHeap = new MinHeap();
  minHeap.push(48);
  minHeap.push(12);
  minHeap.push(24);
  minHeap.push(7);
  minHeap.push(8);
  minHeap.push(-5);
  minHeap.push(24);
  minHeap.push(391);
  minHeap.push(24);
  minHeap.push(56);
  minHeap.push(2);
  minHeap.push(6);
  minHeap.push(8);
  minHeap.push(41);
  minHeap.push(76);
  expect(minHeap.peek()).toEqual(-5);
  expect(minHeap.pop()).toEqual(-5);
  expect(minHeap.peek()).toEqual(2);
  expect(minHeap.pop()).toEqual(2);
  expect(minHeap.peek()).toEqual(6);
  minHeap.push(87);
  expect(minHeap.peek()).toEqual(6);
});

test('heap_ctor_can_eat_array', () => {
  const minHeap = new MinHeap([1, 2, 3]);
  expect(minHeap.peek()).toBe(1);
});

test('heap_with_many_elements_3', () => {
  const minHeap = new MinHeap([
    -823, 164, 48, -987, 323, 399, -293, 183, -908, -376, 14, 980, 965, 842,
    422, 829, 59, 724, -415, -733, 356, -855, -155, 52, 328, -544, -371, -160,
    -942, -51, 700, -363, -353, -359, 238, 892, -730, -575, 892, 490, 490, 995,
    572, 888, -935, 919, -191, 646, -120, 125, -817, 341, -575, 372, -874, 243,
    610, -36, -685, -337, -13, 295, 800, -950, -949, -257, 631, -542, 201,
    -796, 157, 950, 540, -846, -265, 746, 355, -578, -441, -254, -941, -738,
    -469, -167, -420, -126, -410, 59]);

  minHeap.push(2);
  minHeap.push(22);
  minHeap.push(222);
  minHeap.push(2222);
  expect(minHeap.pop()).toEqual(-987);
  expect(minHeap.pop()).toEqual(-950);
  expect(minHeap.pop()).toEqual(-949);
  expect(minHeap.pop()).toEqual(-942);
});

test('heap_with_identifier_set', () => {
  const minHeap = new MinHeap();

  minHeap.push(2, '5');
  minHeap.push(22, '4');
  minHeap.push(222, 7);
  minHeap.push(2222, 6);
  expect(minHeap.peekIdentifier()).toEqual('5');
  expect(minHeap.pop()).toEqual(2);
  expect(minHeap.peekIdentifier()).toEqual('4');
  expect(minHeap.pop()).toEqual(22);
  expect(minHeap.peekIdentifier()).toEqual(7);
  expect(minHeap.pop()).toEqual(222);
  expect(minHeap.peekIdentifier()).toEqual(6);
  expect(minHeap.pop()).toEqual(2222);
  expect(minHeap.peekIdentifier()).toBeUndefined();
});

test('heap_with_secondary', () => {
  const minHeap = new MinHeap();

  minHeap.push(2, '5');
  minHeap.push(222, '4', 1);
  minHeap.push(222, 7);
  minHeap.push(2222, 6);
  expect(minHeap.peekIdentifier()).toEqual('5');
  expect(minHeap.pop()).toEqual(2);
  expect(minHeap.peekIdentifier()).toEqual(7);
  expect(minHeap.pop()).toEqual(222);
  expect(minHeap.peekIdentifier()).toEqual('4');
  expect(minHeap.pop()).toEqual(222);
  expect(minHeap.peekIdentifier()).toEqual(6);
  expect(minHeap.pop()).toEqual(2222);
  expect(minHeap.peekIdentifier()).toBeUndefined();
});
