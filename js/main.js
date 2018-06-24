function getBase64(file) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

fetch('http://localhost:3000/comments').then(function (response) {
	return response.json();
}).then(function (myJson) {
	myJson.forEach(function (element) {
		if (element.avatar) {
			createElement(element.nickname, element.comment, element.avatar, element.id)
		} else {
			createElement(element.nickname, element.comment, 'https://static1.squarespace.com/static/58f7904703596ef4c4bdb2e1/t/5991c101a803bb3bb083acae/1502724567949/no+avatar.png', element.id)
		}
	});
});

var file = document.querySelector(".custom-file-input");
var textarea = document.querySelector(".textarea");
var input = document.querySelector(".input");
var form = document.querySelector(".form");
var comments = document.querySelector(".comments");

form.addEventListener('submit', function (event) {
	event.preventDefault();
	if (file.files[0]) {
		getBase64(file.files[0]).then(function (result) {
			fetch('http://localhost:3000/comments', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					comment: textarea.value,
					nickname: input.value,
					avatar: result
				})
			}).then(function (response) {
				return response.json();
			}).then(function (myJson) {
				if (myJson.avatar) {
					createElement(myJson.nickname, myJson.comment, myJson.avatar, myJson.id)
				} else {
					createElement(myJson.nickname, myJson.comment, 'https://static1.squarespace.com/static/58f7904703596ef4c4bdb2e1/t/5991c101a803bb3bb083acae/1502724567949/no+avatar.png', myJson.id)
				}

				form.reset()
			});
		})
	} else {
		fetch('http://localhost:3000/comments', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				comment: textarea.value,
				nickname: input.value,
				avatar: ''
			})
		}).then(function (response) {
			return response.json();
		}).then(function (myJson) {

			if (myJson.avatar) {
				createElement(myJson.nickname, myJson.comment, myJson.avatar, myJson.id)
			} else {
				createElement(myJson.nickname, myJson.comment, 'https://static1.squarespace.com/static/58f7904703596ef4c4bdb2e1/t/5991c101a803bb3bb083acae/1502724567949/no+avatar.png', myJson.id)
			}

			form.reset()
		});
	}
});

function createElement(name, comment, image, id) {

	var authorName = document.createElement('h6');
	authorName.classList.add('comment-meta', 'name');
	authorName.innerHTML = name;

	var item = document.createElement('li');
	item.setAttribute('data-id', id);
	item.classList.add('comment', 'mb-2', 'row');

	var commentAvatar = document.createElement('div');
	commentAvatar.classList.add('p-0', 'comment-avatar', 'col-md-2', 'text-center');

	var avatarImg = document.createElement('img');
	avatarImg.classList.add('mx-auto', 'img-fluid');
	avatarImg.src = image;

	var commentContent = document.createElement('div');
	commentContent.classList.add('comment-content', 'col-md-10');

	var flexContainer = document.createElement('div');
	flexContainer.classList.add('d-flex', 'justify-content-between');

	var btnGroup = document.createElement('div');
	btnGroup.classList.add('btn-group');

	var edit = document.createElement('button');
	edit.classList.add('btn', 'btn-link', 'text-right', 'small', 'edit');
	edit.innerHTML = 'edit';
	edit.setAttribute('type', 'button');

	var del = document.createElement('button');
	del.classList.add('btn', 'btn-link', 'text-right', 'small', 'del');
	del.innerHTML = 'delete';
	del.setAttribute('type', 'button');

	var commentBody = document.createElement('div');
	commentBody.classList.add('comment-body', 'mb-3');

	var text = document.createElement('p');
	text.classList.add('text');
	text.innerHTML = comment;

	var reply = document.createElement('button');
	reply.classList.add('btn', 'btn-link', 'text-right', 'small', 'reply', 'pl-0');
	reply.innerHTML = 'Reply';
	reply.setAttribute('type', 'button');

	if (comments.children[0]) {
		comments.insertBefore(item, comments.children[0])
	} else (
		comments.appendChild(item)
	);

	item.appendChild(commentAvatar);
	item.appendChild(commentContent);

	commentAvatar.appendChild(avatarImg);

	commentContent.appendChild(flexContainer);
	commentContent.appendChild(commentBody);

	flexContainer.appendChild(authorName);
	flexContainer.appendChild(btnGroup);

	btnGroup.appendChild(edit);
	btnGroup.appendChild(del);

	commentBody.appendChild(text);
	commentBody.appendChild(reply);
}

comments.addEventListener('click', function (event) {
	var element = event.target;

	if (element.classList.contains('del')) {
		var item = element.parentNode.parentNode.parentNode.parentNode;

		if (confirm('delete?')) {
			var id = item.getAttribute('data-id');
			fetch('http://localhost:3000/comments/' + id, {
				method: 'DELETE',
			}).then(function () {
				item.remove();
			});
		}
	}

	if (element.classList.contains('edit')) {
		var textEdited = element.parentNode.parentNode.parentNode.parentNode.querySelector('.comment-body');

		if (!textEdited.parentNode.parentNode.querySelector('.edit-holder')) {
			var editHolder = document.createElement('div');
			editHolder.classList.add('comment-body', 'mb-3', 'edit-holder');

			var currentComment = textEdited.querySelector('.text');

			var textareaText = document.createElement('textarea');
			textareaText.classList.add('textarea-edited', 'textarea', 'form-control');
			textareaText.setAttribute('placeholder', 'New text');
			textareaText.value = currentComment.innerHTML;

			var ok = document.createElement('button');
			ok.classList.add('btn', 'btn-link', 'text-right', 'pl-0', 'small', 'ok');
			ok.innerHTML = 'ok';
			ok.setAttribute('type', 'button');

			var cancel = document.createElement('button');
			cancel.classList.add('btn', 'btn-link', 'text-right', 'small', 'cancel');
			cancel.innerHTML = 'cancel';
			cancel.setAttribute('type', 'button');

			var btnGroupRemove = element.parentNode.parentNode.querySelector('.btn-group');
			btnGroupRemove.style.display = 'none';

			textEdited.parentNode.appendChild(editHolder);

			editHolder.appendChild(textareaText);
			editHolder.appendChild(ok);
			editHolder.appendChild(cancel);

			textEdited.style.display = 'none';
		}
	}
	if (element.classList.contains('ok')) {
		var textInTextarea = element.parentNode.parentNode.querySelector('.text');
		var textInTextareaEdited = element.parentNode.parentNode.querySelector('.textarea-edited');
		var editContainer = element.parentNode;
		var getItem = element.parentNode.parentNode.parentNode;

		if (textInTextareaEdited.value && textInTextareaEdited.value.trim().length) {
			var id = getItem.getAttribute('data-id');
			fetch('http://localhost:3000/comments/' + id, {
				method: 'PATCH',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					comment: textInTextareaEdited.value
				})
			}).then(function (response) {
				return response.json();
			}).then(function () {
				textInTextarea.innerHTML = textInTextareaEdited.value;

				var textInTextareaContainer = textInTextarea.parentNode;
				textInTextareaContainer.removeAttribute('style');

				var btnGroupBack = element.parentNode.parentNode.querySelector('.btn-group');
				btnGroupBack.removeAttribute('style');

				editContainer.remove();
			});

		}
	}
	if (element.classList.contains('cancel')) {
		var backButtons = element.parentNode.parentNode.querySelector('.btn-group');
		var backText = element.parentNode.parentNode.querySelector('.comment-body');
		var editorContainer = element.parentNode;

		backButtons.removeAttribute('style');

		backText.removeAttribute('style');

		editorContainer.remove();
	}
});