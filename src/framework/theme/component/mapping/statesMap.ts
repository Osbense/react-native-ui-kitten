import { StatesPreprocessor } from './statesPreprocessor';

export class StatesMap extends Map<string, object> {

  statesMap: Map<string, object>;
  protected SEARCH_STRING_SPLIT_CHAR: string = '.';

  constructor(mapping: object) {
    super();
    const statesPreprocessor: StatesPreprocessor = new StatesPreprocessor(mapping);
    this.statesMap = statesPreprocessor.calculateState();
  }

  public get(searchString: string): object {
    return this.statesMap.get(this.getKeyBySearchString(searchString));
  }

  private getKeyBySearchString(searchString: string): string {
    const statesMapKeysArrays: string[][] = [...this.statesMap.keys()]
      .map((item: string) => this.splitSearchString(item));
    const searchStringArray: string[] = this.splitSearchString(searchString);
    const resultSearchMatrix: string[][] = statesMapKeysArrays
      .filter((keysArray: string[]) => this.compareStringArrays(searchStringArray, keysArray));
    return resultSearchMatrix.length ? resultSearchMatrix[0].join(this.SEARCH_STRING_SPLIT_CHAR) : '';
  }

  private compareStringArrays(arr1: string[], arr2: string[]): boolean {
    return arr1.length === arr2.length && arr1.reduce((a, b) => a && arr2.includes(b), true)
  }

  private splitSearchString(value: string): string[] {
    return value.split(this.SEARCH_STRING_SPLIT_CHAR);
  }

}
