import React, { useEffect, useState, useContext } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import FeedMessage from './FeedMessage';
import { MainContext } from '../../Context/main-context';
import * as Chat from '../../Model/chat-model';

let useStyles = makeStyles({
	root: {
		backgroundColor: 'gray',
		color: '#fff',
		flexGrow: '1',
		maxHeight: '75vh',
		padding: '1rem',
		overflow: 'hidden',
		overflowY: 'scroll',
	},
});

export default function FeedBody() {
	let classes = useStyles();
	let [messages, setMessages] = useState(null);
	let { currentChatDetails, authUser } = useContext(MainContext);
	useEffect(() => {
		if (!messages) {
			Chat.getChatMessages(currentChatDetails, authUser)
				.then(result => {
					setMessages(result);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}, []);
	return (
		<Container className={classes.root}>
			{messages ? (
				messages.map((message, index) => (
					<FeedMessage
						messageText={message.messageText}
						authorName={message.authorName}
						key={index}
					/>
				))
			) : (
				<div>Waiting for messages to be loaded</div>
			)}
		</Container>
	);
}
