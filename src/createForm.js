import { compose } from 'redux';
import { connect } from 'react-redux';
import { applyReducers } from 'soya-next/redux';
import { initForm } from './_actions';
import reducers from './_reducers';
import createForm from './_createForm';

const createMapDispatchToProps = formId => (dispatch, props) => ({
  dispatch,
  init() {
    let newFormId = formId;
    if (typeof formId === 'function') {
      newFormId = formId(props);
    }
    dispatch(initForm(newFormId));
  },
});

export default formId => compose(
  applyReducers(reducers),
  connect(null, createMapDispatchToProps(formId)),
  createForm(formId)
);
