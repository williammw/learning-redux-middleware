# learning-redux-middleware
# redux-promise going to use
## middleware 
* Action Creator -> Action -> **MiddleWare** -> Reducer


# Approach @ work
#### library used
- redux 
- redux-saga
#### folder structure
``` src/
        components/
            container.js (index.js)
            components.js (TableList)
            saga.js
            action.js
            reducer.js
        rootSaga.js
```

## flow...
1. container 
```

const mapStateToProps = (state, ownProps) => {
  return {
    lang: state.langReducer.lang,
    submission: state.submissionDraftListReducer.submission,
    category_id: ownProps.category_id,
    submission_status: ownProps.submission_status
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        onLoad: () => {
          dispatchProps.dispatch(getSubmissionDraftList(ownProps.category_id, ownProps.submission_status));
        }
    }
}

const DraftListContainer = connect(
  mapStateToProps,
  null,
  mergeProps
)(DraftList);


export default DraftListContainer;
```
2. action.js thats return state 

```import * as actionTypes from '../../constants/actionTypes.js';

export let getSubmissionDraftList = (category_id, submission_status) =>{
  return {
    type: actionTypes.MEMBER_GET_SUBMISSION_DRAFT_LIST,
    category_id: category_id,
    submission_status: submission_status
  }
}
```

3. saga.js
```
export function* watchGetSubmissionDraftList() {
    while (true) {
        const action = yield take(actionTypes.MEMBER_GET_SUBMISSION_DRAFT_LIST);
        yield fork(runGetSubmissionDraftList, action.category_id, action.submission_status);
    }
}
```

4. rootSaga.js

```
import { fork } from 'redux-saga/effects';
import {watchSetLoginSystemUser, watchGetSystemUserList} from './components/Login/saga.js';
import {watchGetSubmissionDraftList} from './components/DraftList/saga.js';
import {watchGetCategoryDraftList} from './components/_CategoryDraftList/saga.js';
import {watchGetSubmissionFollowupList} from './components/MemberFollowUpList/saga.js';
import {watchGetSubmissionStatusCount} from './components/MainMenu/saga.js';
import {watchGetSubmittedList} from './components/SubmittedList/saga.js';
import {watchGetNewFormList} from './components/NewFormList/saga.js';
//import {watchUser} from './saga/testing.js';
import { watchLogOut } from './saga/LogOut.js';

function* rootSaga() {
  yield [
    fork(watchSetLoginSystemUser),
    fork(watchGetSystemUserList),
    fork(watchGetSubmissionDraftList),
    fork(watchGetCategoryDraftList),
    fork(watchGetSubmissionStatusCount),
    fork(watchGetSubmissionFollowupList),
    fork(watchGetSubmittedList),
    fork(watchGetNewFormList),
    watchLogOut(),
  ];
```
5. saga.js (component level)
```
import { take, put, call, fork, select } from 'redux-saga/effects'
import * as actionTypes from '../../constants/actionTypes.js';
import axios from 'axios';

const getGetSubmissionDraftList = (category_id, submission_status) => {
    return axios.get('api/form/getSubmissionList?submission_status='+submission_status+'&category_id='+category_id+'&start=1&end=10')
    .then(function(response) {
        return response;
    })
    .catch(function(error) {
        return error.response;
    });
}

function* runGetSubmissionDraftList(category_id, submission_status) {
    const response = yield call(getGetSubmissionDraftList, category_id, submission_status);
    if (response.status === 200 && response.statusText === 'OK') {
        yield put({ type:actionTypes.MEMBER_SUCCESS_GET_SUBMISSION, submission:response.data
            .map((item) => {
                return {
                    submission_id: item.submission_id,
                    form_id: item.form_id,
                    form_name_chi: item.form_name_chi,
                    form_name_eng: item.form_name_eng,
                    deadline: item.deadline,
                    status: item.status,
                }
            })
        });
    }
    else{
        console.error('API return fail.');
    }
} 

```
6. reducer.js
```
import * as actionTypes from '../../constants/actionTypes.js';

const initialState = {
  submission:[{
    submission_id: 0,
    form_id: 0,
    form_name_chi: '',
    form_name_eng: '',
    deadline: '',
    status: '',
  }]
}

export let submissionDraftListReducer = (state = initialState, action) =>{
  switch(action.type){
    case actionTypes.MEMBER_SUCCESS_GET_SUBMISSION:
      return {
        submission: action.submission
      };
    default:
      break;
  }
  return state;
}
```
component.js (draftList)
```
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Face from 'material-ui/svg-icons/action/face';
import Info from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';

import {style} from './style.js';
import {getChiLangSet} from '../../language_chi.js';
import {getEngLangSet} from '../../language_eng.js';

const componentName = 'DraftList';

class DraftList extends Component{
  constructor(props){
    super(props);
    this.viewForm = this.viewForm.bind(this);
    this.updateDraft = this.updateDraft.bind(this);
    this.fetchRows = this.fetchRows.bind(this);
  }

  componentWillMount(){
    this.props.onLoad();
  }

  updateDraft(submission_id){
    console.log("update draft: " + submission_id)
  }

  viewForm(form_id){
    console.log("view form: " + form_id)
  }

  fetchRows(updateButton, data){
      return data.map((item, i) => {
          return (
            <TableRow>
              <TableRowColumn><a href="#" onClick={()=>this.viewForm(item.form_id)}>{this.props.lang === 'eng' ? item.form_name_eng : item.form_name_chi} ({item.submission_id})</a></TableRowColumn>
            <TableRowColumn>{item.deadline == '1900-1-1' ? '-' : item.deadline}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label={updateButton}
              primary={true}
              secondary={false}
              style={style.button}
              labelStyle={style.buttonLabel}
              onClick={()=>this.updateDraft(item.submission_id)}
            />
          </TableRowColumn>
        </TableRow>
      );
    })
  } 

  render() {
    let langSet = this.props.lang === 'eng' ? getEngLangSet(componentName) : getChiLangSet(componentName);
    let {submission} = this.props;

    return (
      <div>
        <Table style={style.table}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>{langSet.form}</TableHeaderColumn>
              <TableHeaderColumn>{langSet.deadline}</TableHeaderColumn>
              <TableHeaderColumn>{langSet.status}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {this.fetchRows(langSet.updateButton, submission)}
          </TableBody>
        </Table>
      </div>
    );
  }
}

DraftList.propTypes = {
  lang: PropTypes.string.isRequired,
  submission: PropTypes.array.isRequired,
}

export default DraftList;
```