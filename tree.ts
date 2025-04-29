export class SliceTree {
  count = 0;
  line_count = 0;

  *read(_start: number, _end = Number.MAX_SAFE_INTEGER): Generator<string> {
    yield "";
  }

  *line(_index: number): Generator<string> {
    yield "";
  }

  write(_index: number, _text: string): void {
  }

  erase(_index: number, _count: number): void {
  }
}
