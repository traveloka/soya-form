import { compose } from 'redux';
import { connect } from 'react-redux';
import createForm from './_createForm';

export default compose(connect(), createForm);
