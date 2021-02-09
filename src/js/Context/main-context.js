import React, {
	useReducer,
	createContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { getUsers } from '../Model/user-model';

import { authUserReducer, currentChatReducer } from '../Reducers/reducers';

export var MainContext = createContext();

const defaultChatDetails = {
	chatId: '123',
	chatName: 'JR Devs',
	latestMessage: { username: 'Gal', text: 'Hi there Group' },
	participants: [
		{ username: 'Dalit', userId: '123' },
		{ username: 'Gil', userId: '776' },
		{ username: 'Tali', userId: '734' },
	],
}; // Group chat

export function MainContextProvider(props) {
	try {
		var sessionUser = JSON.parse(sessionStorage.getItem('user'));
	} catch (err) {
		sessionUser = undefined;
	}

	const initialState = {
		authUser: sessionUser || null,
		currentChat: null,
	};
	const rootReducer = combineReducers({
		authUser: authUserReducer,
		currentChat: currentChatReducer,
	});

	const [state, dispatch] = useReducer(rootReducer, initialState);
	const store = useMemo(() => [state, dispatch], [state]);

	let { authUser } = state;
	let [users, setUsers] = useState([]);
	let history = useHistory();

	useEffect(() => {
		if (authUser != null) loadData();
		else history.push('/');
	}, [authUser]);

	useEffect(() => {
		!users && loadData().then(data => setUsers(data.users));
	});
	let currentChatDetails = undefined;
	//chatDetails : {chatId , withUser, participants:{name, id}}
	return (
		<MainContext.Provider value={{ users, store, currentChatDetails }}>
			{props.children}
		</MainContext.Provider>
	);

	async function loadData() {
		let users = await getUsers();
		setUsers(users);
	}
}

const combineReducers = slices => (state, action) =>
	Object.keys(slices).reduce(
		(acc, prop) => ({
			...acc,
			[prop]: slices[prop](acc[prop], action),
		}),
		state
	);
