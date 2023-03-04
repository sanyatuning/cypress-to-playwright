export const isHook = {
  beforeEach(expressionName: string) {
    return 'beforeEach' === expressionName;
  },
  it(expressionName: string) {
    return 'it' === expressionName || this.isItSkipOrOnly(expressionName);
  },
  isItSkipOrOnly(expressionName: string) {
    return 'it.only' === expressionName || 'it.skip' === expressionName;
  },
};