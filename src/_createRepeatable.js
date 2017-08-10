import React from 'react';
import PropTypes from 'prop-types';
import { formShape } from './_propTypes';
import {
  createGetName,
  getDisplayName,
} from './_utils';

export default Component => {
  class CreateRepeatable extends React.Component {
    static displayName = getDisplayName('CreateRepeatable', Component);

    static propTypes = {
      form: formShape.isRequired, // eslint-disable-line react/no-unused-prop-types
      length: PropTypes.number.isRequired,
      maxLength: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
      minLength: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
      name: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ])).isRequired,
      addListItem: PropTypes.func.isRequired,
      removeListItem: PropTypes.func.isRequired,
      reorderListItem: PropTypes.func.isRequired,
      reorderListItemDec: PropTypes.func.isRequired,
      reorderListItemInc: PropTypes.func.isRequired,
    };

    static defaultProps = {
      minLength: 0,
    };

    addListItem = () => {
      const names = this.props.name;
      if (typeof names[names.length - 1] === 'string') {
        names.push(names.length);
      }
      this.props.addListItem(names)();
    };

    removeListItem = index => this.props.removeListItem(this.props.name)(index);

    reorderListItem = (index, targetIndex) => this.props.reorderListItem(this.props.name)(index, targetIndex);

    reorderListItemDec = (index, amount) => this.props.reorderListItemDec(this.props.name)(index, amount);

    reorderListItemInc = (index, amount) => this.props.reorderListItemInc(this.props.name)(index, amount);

    render() {
      return (
        <div>
          {new Array(this.props.length).fill(null).map((_, index) => (
            <Component
              {...this.props}
              index={index}
              key={index}
              name={createGetName(this.props.name, index)}
              totalItem={this.props.length}
              addListItem={this.addListItem}
              removeListItem={this.removeListItem}
              reorderListItem={this.reorderListItem}
              reorderListItemDec={this.reorderListItemDec}
              reorderListItemInc={this.reorderListItemInc}
            />
          ))}
        </div>
      );
    }
  }

  return CreateRepeatable;
};
