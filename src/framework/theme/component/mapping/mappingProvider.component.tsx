import React from 'react';
import MappingContext from './mappingContext';
import { ThemeMappingType } from './type';
import { StatesMap } from './statesMap';

export interface Props {
  mapping: ThemeMappingType;
  children: JSX.Element | React.ReactNode;
}

export class MappingProvider extends React.PureComponent<Props> {

  componentWillMount() {
    const statesMap: StatesMap = new StatesMap(this.props.mapping);
    console.log(statesMap.get('checked.default.Radio.error'));
  }

  render() {
    return (
      <MappingContext.Provider
        value={this.props.mapping}>
        {this.props.children}
      </MappingContext.Provider>
    );
  }
}
