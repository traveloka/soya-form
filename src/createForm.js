import { compose } from 'redux';
import { connect } from 'react-redux';
import applyReducers from 'soya-next/lib/redux/applyReducers';
import { initForm } from './_actions';
import reducers from './_reducers';
import createForm from './_createForm';

const createMapDispatchToProps = formId => (dispatch, props) => ({
  dispatch,
  init() {
    dispatch(initForm(formId));
  },
});

export default formId => compose(
  applyReducers(reducers),
  connect(null, createMapDispatchToProps(formId)),
  createForm(formId)
);
