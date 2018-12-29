interface StateStyleObject {
  state: string;
  styles: object;
}

interface MappingStateObject {
  mapping?: StateObject;
}

interface StateObject {
  state?: any;
}

export class StatesPreprocessor {

  mapping: object;
  private MAPPING_KEY_NAME: string = 'mapping';
  private STATE_KEY_NAME: string = 'state';
  private VARIANT_KEY_NAME: string = 'variant';

  constructor(mapping: object) {
    this.mapping = mapping;
  }

  public calculateState(): Map<string, object> {
    let componentsStatesMap: Map<string, object> = new Map();
    Object.keys(this.mapping).forEach((componentName: string) => {
      Object.keys(this.mapping[componentName].appearance)
        .forEach((componentAppearance: string) => {
          this.getDefaultStates(
            this.mapping[componentName].appearance[componentAppearance],
            componentName,
            componentAppearance,
          ).forEach(item => componentsStatesMap.set(item.state, item.styles));
          this.getVariantStates(
            this.mapping[componentName].appearance[componentAppearance],
            componentName,
            componentAppearance
          ).forEach(item => componentsStatesMap.set(item.state, item.styles));
        });
    });
    return componentsStatesMap;
  }

  private getDefaultStates(obj: MappingStateObject,
                           componentName: string,
                           componentAppearance: string): StateStyleObject[] {
    let stateStyles: StateStyleObject[] = [];
    if (this.hasAppearanceMappingState(obj)) {
      const states = obj.mapping.state;
      Object.keys(states).forEach((stateName: string) => {
        stateStyles.push({
          state: `${componentName}.${componentAppearance}.${stateName}`,
          styles: obj.mapping.state[stateName],
        });
      });
      return stateStyles;
    } else {
      return [];
    }
  }

  private getVariantStates(obj: MappingStateObject,
                           componentName: string,
                           componentAppearance: string): StateStyleObject[] {
    let stateStyles: StateStyleObject[] = [];
    if (this.hasAppearanceVariant(obj)) {
      Object.keys(obj[this.VARIANT_KEY_NAME])
        .forEach((appearanceVariant: string) => {
          const variant: any = obj[this.VARIANT_KEY_NAME][appearanceVariant];
          Object.keys(variant).forEach((variantName: string) => {
            if (this.hasAppearanceMappingState(variant[variantName])) {
              Object.keys(variant[variantName].mapping.state).forEach((stateName: string) => {
                stateStyles.push({
                  state: `${componentName}.${componentAppearance}.${variantName}.${stateName}`,
                  styles: variant[variantName].mapping.state[stateName],
                })
              });
            }
          });
        });
      return stateStyles;
    } else {
      return [];
    }
  }

  private hasAppearanceVariant(obj: Object): boolean {
    return obj && obj.hasOwnProperty(this.VARIANT_KEY_NAME) && !this.isEmpty(obj[this.VARIANT_KEY_NAME]);
  }

  private hasAppearanceMappingState(obj: Object): boolean {
    return this.hasAppearanceMapping(obj) &&
      obj[this.MAPPING_KEY_NAME].hasOwnProperty(this.STATE_KEY_NAME) &&
      !this.isEmpty(obj[this.MAPPING_KEY_NAME][this.STATE_KEY_NAME]);
  }

  private isEmpty(obj: Object): boolean {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  private hasAppearanceMapping(obj: Object): boolean {
    return obj.hasOwnProperty(this.MAPPING_KEY_NAME);
  }

}
