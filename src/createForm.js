import { compose } from 'redux';
import { connect } from 'react-redux';
import createForm from './_createForm';

export default (formId) => compose(connect(), createForm(formId));
