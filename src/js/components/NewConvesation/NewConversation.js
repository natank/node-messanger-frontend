/**icons */
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckIcon from '@material-ui/icons/Check';

/**Third party */
import { Container, Fab, Input } from '@material-ui/core';
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

/**app components */
import Header from './NewConversationHeader';
import SelectedUsers from './SelectedUsers';
import UserList from './UserList';

/**App context */
import { MainContext } from '../../Context/main-context';

/** Utils */
import { submitNewConversation } from '../../Utils/utils';

let useStyles = makeStyles(theme => ({
	root: {
		position: 'relative',
	},
	action: {
		position: 'fixed',
		top: '80vh',
		right: '30%',
		zIndex: '1000',
		backgroundColor: 'green',
	},
	input: {
		paddingTop: '2rem',
		paddingBottom: '3rem',
	},
	submit: {
		position: 'absolute',
		top: '8rem',
		right: '0',
		backgroundColor: 'green',
	},
}));

export default function NewConversation() {
	/**Hooks */
	const classes = useStyles();
	const history = useHistory();

	/**Context  */
	const mainContext = useContext(MainContext);
	const { store } = mainContext;

	/**Global state */
	const [state, dispatch] = store;
	const { users, authUser } = state;

	/**Local state */
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [mode, setMode] = useState('start'); /*search, subject */
	const [groupName, setGroupName] = useState('');
	const [usersFilter, setUsersFilter] = useState('');

	const displayedListUsers = handleDisplayedListUsers();

	return (
		<Container disableGutters={true}>
			<Header
				modeProp={[mode, setMode]}
				usersFilterProp={[usersFilter, setUsersFilter]}
			/>
			{mode == 'subject' ? (
				<Container disableGutters={true} className={classes.input}>
					<Input
						fullWidth={true}
						placeholder='Type group subject here...'
						value={groupName}
						onChange={event => {
							setGroupName(event.target.value);
						}}
					/>
				</Container>
			) : null}

			<SelectedUsers selectedUsers={[...selectedUsers]} mode={mode} />

			{mode !== 'subject' ? (
				<UserList onUserSelected={onUserSelected} users={displayedListUsers} />
			) : null}

			{/**submit group button*/}

			{selectedUsers.length > 0 && groupName.length > 0 ? (
				<Fab
					color='secondary'
					className={classes.submit}
					onClick={() => {
						submitNewConversation({
							members: selectedUsers,
							authUser,
							groupName,
						})
							.then(conversation => {
								dispatch({
									type: 'ADD_CONVERSATIONS',
									payload: conversation,
								});
								history.push('/');
							})
							.catch(err => console.log(err));
					}}>
					<CheckIcon />
				</Fab>
			) : null}

			{/**Clicking this button to continue to group subject button */}

			{selectedUsers.length > 0 && mode !== 'subject' ? (
				<Fab
					color='secondary'
					className={classes.action}
					onClick={() => setMode('subject')}>
					<ArrowForwardIcon />
				</Fab>
			) : null}
		</Container>
	);

	async function onUserSelected(userId) {
		const selectedUser = users.find(user=>user.id == userId);

		//add the user to the selected users
		let extendedSelectedUsers = [...selectedUsers, selectedUser];
		setSelectedUsers(extendedSelectedUsers);
	}

	function handleDisplayedListUsers(){
		const displayedListUsersLocal = users.filter(user => {
			const regex = new RegExp(`^${usersFilter}`);
			const isUserSelected = selectedUsers.some(selectedUser=>selectedUser.id == user.id)
			if (!isUserSelected && regex.exec(user.username) ) return true;
		});

		return displayedListUsersLocal;
	}

	async function onFilterChange(filter) {
		setUsersFilter(filter);
	}
}
